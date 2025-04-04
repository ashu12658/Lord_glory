const mongoose = require('mongoose');

const agentCommissionSchema = new mongoose.Schema({
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AgentOrder',
        required: true
    },
    commission: {   
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AgentCommission', agentCommissionSchema);
