const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String // ✅ Each agent gets a unique coupon code
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Agent', agentSchema);
    