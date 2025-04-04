// src/components/PlaceOrder.js

import React, { useState } from 'react';

const PlaceOrder = () => {
    const [customerName, setCustomerName] = useState('');
    const [products, setProducts] = useState([{ productId: '', quantity: 1 }]);

    const handleAddProduct = () => {
        setProducts([...products, { productId: '', quantity: 1 }]);
    };

    const handleRemoveProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call the API to place the order
        console.log({ customerName, products });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Customer Name</label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                />
            </div>

            {products.map((product, index) => (
                <div key={index}>
                    <label>Product {index + 1}</label>
                    <input
                        type="text"
                        value={product.productId}
                        onChange={(e) =>
                            setProducts(
                                products.map((p, i) =>
                                    i === index ? { ...p, productId: e.target.value } : p
                                )
                            )
                        }
                        required
                    />
                    <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                            setProducts(
                                products.map((p, i) =>
                                    i === index ? { ...p, quantity: e.target.value } : p
                                )
                            )
                        }
                        required
                    />
                    <button type="button" onClick={() => handleRemoveProduct(index)}>
                        Remove Product
                    </button>
                </div>
            ))}

            <button type="button" onClick={handleAddProduct}>
                Add Product
            </button>
            <button type="submit">Place Order</button>
        </form>
    );
};

export default PlaceOrder;
