import React, { useState } from 'react';
import axios from 'axios';

const AdminWithdrawals = () => {
    const [agentId, setAgentId] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleWithdraw = () => {
        axios.post('/api/admin/withdraw', { agentId, amount: Number(amount) }, { withCredentials: true })
            .then(response => setMessage(response.data.msg))
            .catch(error => setMessage(error.response?.data?.msg || 'Error processing withdrawal'));
    };

    return (
        <div>
            <h2>Withdraw Agent Earnings</h2>
            <input type="text" placeholder="Agent ID" value={agentId} onChange={e => setAgentId(e.target.value)} />
            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
            <button onClick={handleWithdraw}>Withdraw</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminWithdrawals;
