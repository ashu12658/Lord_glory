const express = require('express');
const router = express.Router();
const usecontroller = require('../controllers/usecontroller');

// User registration
router.post('/register', usecontroller.registerUser);

// User login
router.post('/login', usecontroller.login);
router.get('/:id', usecontroller.getUserDetails);

module.exports = router;
