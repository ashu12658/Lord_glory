import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // States for product management
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState(null); // Current product being edited

  // State for order status changes; maps orderId to the new status
  const [orderStatusChanges, setOrderStatusChanges] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/admin-login');
        return;
      }

      try {
        const [usersResponse, ordersResponse, productsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/admin/orders', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/admin/products', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUsers(usersResponse.data);
        setOrders(ordersResponse.data);
        setProducts(productsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
      }
    };

    fetchData();
  }, [navigate]);

  // Refresh orders and products data after a change
  const refreshData = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [ordersResponse, productsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/orders', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setOrders(ordersResponse.data);
      setProducts(productsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh data.');
    }
  };

  // --------------------
  // ORDER MANAGEMENT
  // --------------------

  // Record local changes for an order's status
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrderStatusChanges(prev => ({ ...prev, [orderId]: newStatus }));
  };

  // Call backend endpoint to update order status
  const updateOrderStatus = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    const newStatus = orderStatusChanges[orderId];
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local orders state with the new status
      setOrders(prevOrders =>
        prevOrders.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  // --------------------
  // PRODUCT MANAGEMENT
  // --------------------

  // Handle input changes for creating a new product
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  // Create a new product
  const createProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(
        'http://localhost:5000/api/admin/products',
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProduct({
        name: '',
        price: '',
        stock: '',
        description: '',
        category: '',
        image: ''
      });
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    }
  };

  // Delete an existing product
  const deleteProduct = async (productId) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  // Start editing a product by setting it in state
  const startEditingProduct = (product) => {
    setEditingProduct(product);
  };

  // Handle changes in the edit product form
  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  // Update an existing product
  const updateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(
        `http://localhost:5000/api/admin/products/${editingProduct._id}`,
        editingProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingProduct(null);
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {error && <p className="error-message">{error}</p>}

      <div className="tabs">
        <button
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={activeTab === 'orders' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'products' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      <div className="content">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="section">
            <h2>Users</h2>
            {users.length > 0 ? (
              <ul>
                {users.map((user) => (
                  <li key={user._id} className="item">
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="section">
            <h2>Orders</h2>
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order._id} className="item">
                    <p>
                      <strong>Order ID:</strong> {order._id}
                    </p>
                    <p>
                      <strong>Total:</strong> ${order.total}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <div>
                      <select
                        value={orderStatusChanges[order._id] || order.status}
                        onChange={(e) =>
                          handleOrderStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button onClick={() => updateOrderStatus(order._id)}>
                        Update Status
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="section">
            <h2>Products</h2>
            {/* Form for Creating a New Product */}
            <form onSubmit={createProduct} className="product-form">
              <h3>Create New Product</h3>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newProduct.name}
                onChange={handleProductInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleProductInputChange}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={handleProductInputChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleProductInputChange}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newProduct.category}
                onChange={handleProductInputChange}
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={newProduct.image}
                onChange={handleProductInputChange}
              />
              <button type="submit">Create Product</button>
            </form>

            {/* Form for Editing a Product */}
            {editingProduct && (
              <form onSubmit={updateProduct} className="product-form">
                <h3>Edit Product</h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editingProduct.name}
                  onChange={handleEditProductInputChange}
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={editingProduct.price}
                  onChange={handleEditProductInputChange}
                  required
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={editingProduct.stock}
                  onChange={handleEditProductInputChange}
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={editingProduct.description}
                  onChange={handleEditProductInputChange}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={editingProduct.category}
                  onChange={handleEditProductInputChange}
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={editingProduct.image}
                  onChange={handleEditProductInputChange}
                />
                <button type="submit">Update Product</button>
                <button type="button" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
              </form>
            )}

            {/* List of Products */}
            {products.length > 0 ? (
              <ul>
                {products.map((product) => (
                  <li key={product._id} className="item">
                    <p>
                      <strong>Name:</strong> {product.name}
                    </p>
                    <p>
                      <strong>Price:</strong> ${product.price}
                    </p>
                    <p>
                      <strong>Stock:</strong> {product.stock}
                    </p>
                    <p>
                      <strong>Description:</strong> {product.description}
                    </p>
                    <div>
                      <button onClick={() => startEditingProduct(product)}>
                        Edit
                      </button>
                      <button onClick={() => deleteProduct(product._id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;