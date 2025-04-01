import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgentCommissions = ({ agentId }) => {  // ✅ Receive agentId as a prop
    const [commissions, setCommissions] = useState([]);

    useEffect(() => {
        const fetchCommissions = async () => {
            try {
                if (!agentId) {
                    console.error("Error: agentId is undefined");
                    return;
                }

                const response = await axios.get(`/api/agent/commissions/${agentId}`);
                setCommissions(response.data);
            } catch (error) {
                console.error('Error fetching commissions:', error);
            }
        };

        fetchCommissions();
    }, [agentId]); // ✅ Add agentId as a dependency

    return (
        <div>
            <h2>Your Commissions</h2>
            <ul>
                {commissions.map((commission) => (
                    <li key={commission._id}>
                        {commission.amount} - {commission.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AgentCommissions;
