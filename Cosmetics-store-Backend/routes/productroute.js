const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require('../controllers/product');

// ✅ Get all products with pagination (Public)
router.get('/', getAllProducts);

// ✅ Get a product by ID (Public)
router.get('/:id', getProductById);

// ✅ Create a new product (Admin-only)
router.post('/',  admin, createProduct);

// ✅ Update a product by ID (Admin-only)
router.put('/:id', protect, admin, updateProduct);

// ✅ Delete a product by ID (Admin-only)
router.delete('/:id', protect, admin, deleteProduct);

// ✅ Search products by keyword or category (Public)
router.get('/search', searchProducts);

module.exports = router;
