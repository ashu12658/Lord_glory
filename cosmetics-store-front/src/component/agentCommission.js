// src/components/AgentCommissions.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgentCommissions = () => {
    const [commissions, setCommissions] = useState([]);

    useEffect(() => {
        // Fetch the agent's commissions
        const fetchCommissions = async () => {
            try {
                const response = await axios.get(`/api/agent/commissions/${agentId}`);
                setCommissions(response.data);
            } catch (error) {
                console.error('Error fetching commissions:', error);
            }
        };

        fetchCommissions();
    }, []);

    return (
        <div>
            <h2>Commissions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Commission</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {commissions.map((commission) => (
                        <tr key={commission._id}>
                            <td>{commission.orderId.customerName}</td>
                            <td>{commission.commission}</td>
                            <td>{commission.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AgentCommissions;
