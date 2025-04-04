const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: true }, // ✅ Ensure password is fetched
  role: { type: String, enum: ["user", "agent", "admin"], default: "user" },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String,  }, // 📌 Add this line
}, { timestamps: true });

// ✅ Hash password only when modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// ✅ Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// Prevent model overwrite error
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
