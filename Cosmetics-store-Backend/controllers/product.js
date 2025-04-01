const Product = require('../models/product'); // Import the Product model
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId

// Get all products with optional pagination
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values

    // Pagination logic
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(); // Total number of products
    res.status(200).json({
      products,
      totalProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (err) {
    console.error("Error fetching products:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new product (Admin-only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ name, description, price, category, stock });
    const product = await newProduct.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("Error creating product:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product by ID (Admin-only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product by ID (Admin-only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};

// Search products by keyword or category
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;

    const query = {};
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (err) {
    console.error("Error searching products:", err.stack);
    res.status(500).json({ message: "Server error" });
  }
};
