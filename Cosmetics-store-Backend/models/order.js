const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackingUpdates: [
    {
      location: { type: String, required: true },
      trackingStatus: { type: String, required: true },
      updatedAt: { type: Date, default: Date.now }
    }
  ],
  
  product: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    }
  ],
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },  // ✅ Added Address field
  phone: { type: String, required: true },
  pincode: { type: String, required: true, match: /^[1-9][0-9]{5}$/ }, // Add pincode validation
  deliveryTime: { type:String,required:false},
  couponCode: { type: String, default: null }, // Store coupon code used
  discountApplied: { type: Number, default: 0 }, // Track discount amount

  referencedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null }, // Track agent who referred the user
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
orderStatus: {
enum:['payment-pending','payment-success','payment-failed'],
}

}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);
