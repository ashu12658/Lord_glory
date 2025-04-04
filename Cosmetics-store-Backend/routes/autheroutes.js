const express = require("express");
const cors = require("cors");
const { registerUser, login } = require("../controllers/authController");

const router = express.Router();

// Cors
/*
express.use(cors({
    origin: ["https://www.lordglory.in"], // Allow frontend requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));*/

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", login);

module.exports = router;
