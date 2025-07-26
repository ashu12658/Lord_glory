const express = require('express');
const router = express.Router();
const skinCareController = require('../controllers/skincontroller');
const { protect, admin } = require('../middleware/authmiddleware');
const upload = require("../middleware/uploadMiddleware"); // Ensure this middleware exists

// Route for submitting the skin care form (only accessible for authenticated users)
router.post('/submit-skin-care-form', protect, upload.array('images', 1), skinCareController.submitSkinCareForm);

// Route for getting all skin care forms (only accessible by admin)
router.get('/get-skin-care-forms', protect, admin, skinCareController.getSkinCareForms);

module.exports = router;
