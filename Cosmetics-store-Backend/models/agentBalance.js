const mongoose = require('mongoose');

const agentBalanceSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalCommission: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Method to calculate balance
agentBalanceSchema.methods.calculateBalance = function (commissionPerOrder) {
    this.balance = this.totalOrders * commissionPerOrder;
    return this.balance;
};

module.exports = mongoose.model('AgentBalance', agentBalanceSchema);
