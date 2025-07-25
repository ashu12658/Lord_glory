const express = require('express');
const router = express.Router();
const usecontroller = require('../controllers/usecontroller');
const adminController = require("../controllers/admincontroller");

// User registration
router.post('/register', usecontroller.registerUser);

// User login
router.post('/login', usecontroller.login);
router.get('/:id', usecontroller.getUserDetails);
router.put("/make-admin", adminController.makeAdmin);


module.exports = router;
