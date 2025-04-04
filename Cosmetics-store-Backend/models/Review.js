const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  certifiedBuyerName: { type: String, required: true }, // ✅ Added Buyer Name
  location: { type: String, required: true }, // ✅ Added Location
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
