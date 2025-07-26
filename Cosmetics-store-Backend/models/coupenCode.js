const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  discount: { type: Number, required: true }, // Discount percentage or fixed amount
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, // ✅ Reference to Agent

});

module.exports = mongoose.model("Coupon", couponSchema);
