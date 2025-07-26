require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Agent = require('../models/agentSchema');
const User = require('../models/User');
const Otp = require('../models/otpSchema');

const router = express.Router();

// 📌 Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// 📌 Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// 📌 Find user in Agent or User collection
const findUserByEmail = async (email) => {
  const agent = await Agent.findOne({ email });
  if (agent) return { user: agent, role: 'agent' };

  const user = await User.findOne({ email });
  if (user) return { user, role: 'user' };

  return null;
};

// 📌 Request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await findUserByEmail(email);
    if (!userData) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Delete old OTP if it exists
    await Otp.deleteOne({ email });

    // Save new OTP in database
    await Otp.create({ email, otp, expiresAt });

    // Send OTP via email (Spam-Free)
    await transporter.sendMail({
      from: '"Lorg Glory" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: '🔐 Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px;">
          <h2 style="color: #333;">Your OTP for Password Reset</h2>
          <p style="font-size: 16px;">Use the following OTP to reset your password:</p>
          <h3 style="font-size: 24px; background: #f8f8f8; padding: 10px; border-radius: 5px; text-align: center;">${otp}</h3>
          <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
      headers: {
        'X-Mailer': 'Nodemailer',
        'X-Priority': '1'
      }
    });

    console.log(`✅ OTP ${otp} sent to ${email}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
});

// 📌 Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    // OTP verified, delete from database
    await Otp.deleteOne({ email });

    res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
});

// 📌 Reset Password
// 📌 Reset Password
// 📌 Reset Password API
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    console.log("Received reset password request:", { email, otp, newPassword });

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const userData = await findUserByEmail(email);
    if (!userData) return res.status(404).json({ message: "User not found" });

    const { user } = userData;

    // 🔴 🛑 **IMPORTANT: Disable automatic hashing**
    user.password = newPassword.trim(); // Store plain password
    await user.save(); // This will trigger pre('save'), hashing it only once.

    console.log("✅ Updated User Password in DB:", user.password);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post('/login-otp', async (req, res) => {
  const { email } = req.body;

  try {
      const userData = await findUserByEmail(email);
      if (!userData) return res.status(404).json({ message: 'User not found' });

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      // Delete old OTP if it exists
      await Otp.deleteOne({ email });

      // Save new OTP
      await Otp.create({ email, otp, expiresAt });

      // Send OTP via email
      await transporter.sendMail({
          from: '"Cosmetic Store" <' + process.env.EMAIL_USER + '>',
          to: email,
          subject: '🔑 Your OTP for Login',
          text: `Your OTP for login is: ${otp}. It will expire in 10 minutes.`,
          html: `<h3>Your OTP for login: <b>${otp}</b></h3><p>Expires in 10 minutes.</p>`
      });

      console.log(`✅ OTP ${otp} sent to ${email}`);
      res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
      console.error('❌ Error sending OTP:', err);
      res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
});


router.post('/verify-login-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
      const otpRecord = await Otp.findOne({ email, otp });

      if (!otpRecord || otpRecord.expiresAt < new Date()) {
          return res.status(400).json({ message: 'OTP expired or invalid' });
      }

      // OTP verified, delete from database
      await Otp.deleteOne({ email });

      const userData = await findUserByEmail(email);
      if (!userData) return res.status(404).json({ message: 'User not found' });

      const { user } = userData;

      // Generate JWT token
      const token = jwt.sign(
          { userId: user._id, isAdmin: user.isAdmin, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
      );

      res.json({
          message: 'Login successful',
          token,
          user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              role: user.role
          }
      });
  } catch (err) {
      console.error('❌ Error verifying OTP:', err);
      res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
});


module.exports = router;
