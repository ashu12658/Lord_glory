// src/components/WithdrawEarnings.js

import React, { useState } from 'react';
import axios from 'axios';

const WithdrawEarnings = () => {
    const [amount, setAmount] = useState('');

    const handleWithdraw = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/api/agent/withdraw/${agentId}`, { amount });
            alert('Withdrawal successful');
        } catch (error) {
            alert('Error withdrawing earnings');
        }
    };

    return (
        <form onSubmit={handleWithdraw}>
            <div>
                <label>Amount to Withdraw</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Withdraw</button>
        </form>
    );
};

export default WithdrawEarnings;
