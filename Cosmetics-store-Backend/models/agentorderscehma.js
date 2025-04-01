const mongoose = require('mongoose');

const agentOrderSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        commission: {
            type: Number,
            required: true
        }
    }],
    totalCommission: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'Completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AgentOrder', agentOrderSchema);

