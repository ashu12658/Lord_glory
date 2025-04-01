import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/orders', { withCredentials: true })
            .then(response => setOrders(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>All Agent Orders</h2>
            {orders.length === 0 ? <p>No orders found.</p> :
                <ul>
                    {orders.map(order => (
                        <li key={order._id}>
                            <strong>Agent:</strong> {order.agentId.name} - {order.agentId.email} <br />
                            <strong>Customer:</strong> {order.customerName} <br />
                            <strong>Status:</strong> {order.status} <br />
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
};

export default AdminOrders;
