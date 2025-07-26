const mongoose = require("mongoose");
const Review = require('../models/Review'); // Import Review model

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  averageRating: { type: Number, default: 0 }, // Precomputed average rating
  numberOfReviews: { type: Number, default: 0 } // Count of reviews
}, { timestamps: true });

// Static method to update average rating and review count
productSchema.statics.updateAverageRating = async function (productId) {
  try {
    const reviews = await Review.find({ productId });

    if (reviews.length === 0) {
      await this.findByIdAndUpdate(productId, {
        averageRating: 0,
        numberOfReviews: 0
      });
      return;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await this.findByIdAndUpdate(productId, {
      averageRating,
      numberOfReviews: reviews.length
    });
  } catch (err) {
    console.error(`Error updating average rating: ${err.message}`);
  }
};

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;