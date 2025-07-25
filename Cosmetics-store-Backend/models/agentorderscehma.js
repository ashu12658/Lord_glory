const mongoose = require("mongoose");

const agentOrderSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },      // ✅ New
  customerPhone: { type: String, required: true },      // ✅ New
  customerAddress: { type: String, required: true },    // ✅ New
  customerPincode: { type: String, required: true },    // ✅ New

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      commission: Number,
    },
  ],
  totalCommission: Number,
  status: {
    type: String,
    enum: ["pending", "completed","success"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("AgentOrder", agentOrderSchema);
