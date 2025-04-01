const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const { protect } = require('../middleware/authMiddleware'); // Middleware for user authentication

const router = express.Router();

// ✅ Route to submit a review
router.post("/review", protect, async (req, res) => {
  let { productId, rating, reviewText, certifiedBuyerName, location } = req.body;

  // ✅ Validate required fields
  if (!productId || !rating || !reviewText || !certifiedBuyerName || !location) {
    return res.status(400).json({ message: "❌ All fields are required." });
  }

  try {
    // ✅ Convert productId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "❌ Invalid Product ID format." });
    }
    productId = new mongoose.Types.ObjectId(productId);

    // ✅ Create a new review
    const newReview = new Review({
      productId,
      userId: req.user._id, // ✅ Authenticated user
      rating,
      reviewText,
      certifiedBuyerName,
      location
    });

    // ✅ Save the review
    await newReview.save();
    res.status(201).json({ message: "✅ Review submitted successfully", review: newReview });
  } catch (err) {
    console.error("❌ Error submitting review:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Route to get all reviews for a product
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  // ✅ Check if productId is valid
  if (!productId || productId === "undefined") {
    return res.status(400).json({ message: "❌ Product ID is missing or invalid." });
  }

  try {
    // ✅ Fetch reviews and populate user details
    const reviews = await Review.find({ productId }).populate("userId", "name location");

    if (!reviews.length) {
      return res.status(404).json({ message: "❌ No reviews found for this product." });
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
