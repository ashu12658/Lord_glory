
const express = require("express");
const { registerUser, login } = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", login);

module.exports = router;
