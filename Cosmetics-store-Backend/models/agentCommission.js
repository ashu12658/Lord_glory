// const mongoose = require('mongoose');

// const AgentCommissionSchema = new mongoose.Schema({
//     agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
//     order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
//     commissionAmount: Number,
//     couponCode: { type: String, required: false }, // Optional field
//     discountAmount: { type: Number, default: 0 }, // If you want to track the discount
//   });
  

// module.exports = mongoose.model('AgentCommission', AgentCommissionSchema);
// 
const mongoose = require('mongoose');

const AgentCommissionSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    commissionAmount: Number,
    couponCode: { type: String, required: false }, // Optional field
    discountAmount: { type: Number, default: 0 }, // If you want to track the discount
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }, // Track if commission is paid
    paidDate: { type: Date, default: null }, // Date when commission is marked as paid
});

module.exports = mongoose.model('AgentCommission', AgentCommissionSchema);

