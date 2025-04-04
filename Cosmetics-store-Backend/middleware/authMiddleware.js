const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const agentSchema = require('../models/agentSchema');

// Register user
exports.registerUser = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, isAdmin: isAdmin || false });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.isAdmin ? 'admin' : 'agent' },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin ? 'admin' : 'agent'
      }
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Protect route middleware to authenticate users
const protect = async (req, res, next) => {
  console.log('Headers:', req.headers);
  
  try {
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};


// Admin authorization middleware to restrict access to admins only
const admin = (req, res, next) => {
  console.log('Admin check:', {
    userIsAdmin: req.user?.isAdmin,
    tokenIsAdmin: req.token?.isAdmin,
    userRole: req.user?.role
  });

  if (!req.user || (!req.user.isAdmin && !req.token?.isAdmin)) {
    return res.status(403).json({ message: 'Access denied, admin privileges required' });
  }

  next();
};

const agent = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains agent id and role
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};


module.exports = { protect, admin,agent };
