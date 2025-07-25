import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import React from 'react'; 

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [agentOrders, setAgentOrders] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [skinCareForms, setSkinCareForms] = useState([]);

  // States for product management
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // States for order management
  const [orderStatusChanges, setOrderStatusChanges] = useState({});
  const [trackingUpdates, setTrackingUpdates] = useState({
    orderId: '',
    location: '',
    trackingStatus: ''
  });

  // States for agent withdrawal
  const [withdrawalData, setWithdrawalData] = useState({
    agentId: '',
    amount: ''
  });

  // State for making admin
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/admin-login');
        return;
      }

      try {
        const [usersResponse, ordersResponse, productsResponse, agentOrdersResponse, commissionsResponse] = 
          await Promise.all([
            axios.get("http://localhost:5000/api/admin/users", {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get("http://localhost:5000/api/admin/orders", {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get("http://localhost:5000/api/admin/products", {
              headers: { Authorization: `Bearer ${token}` }
            }),
            axios.get("http://localhost:5000/api/admin/orders", {
              headers: { Authorization: `Bearer ${token}` }
            }),
          ]);

        setUsers(usersResponse.data);
        setOrders(ordersResponse.data);
        setProducts(productsResponse.data);
        setAgentOrders(agentOrdersResponse.data);
        setCommissions(commissionsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'skincare') {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No token found. Please log in.');
        navigate('/admin-login');
        return;
      }

      axios.get("http://localhost:5000/api/skincare/get-skin-care-forms", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setSkinCareForms(response.data))
        .catch(err => {
          console.error("Failed to fetch skin care forms:", err);
          setError(err.response?.data?.message || 'Failed to fetch skin care forms.');
        });
    }
  }, [activeTab, navigate]);

  const refreshData = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const [ordersResponse, productsResponse, agentOrdersResponse, commissionsResponse] = 
        await Promise.all([
          axios.get("http://localhost:5000/api/admin/orders", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/products", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/admin/orders", {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);
      setOrders(ordersResponse.data);
      setProducts(productsResponse.data);
      setAgentOrders(agentOrdersResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh data.');
    }
  };

  const refreshSkinCareForms = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.get("http://localhost:5000/api/skincare/get-skin-care-forms", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkinCareForms(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh skin care forms.');
    }
  };

  // Order Management
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrderStatusChanges(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const updateOrderStatus = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    const newStatus = orderStatusChanges[orderId];
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prevOrders =>
        prevOrders.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleTrackingInputChange = (e) => {
    const { name, value } = e.target;
    setTrackingUpdates(prev => ({ ...prev, [name]: value }));
  };

  const updateTracking = async (orderId) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/tracking`,
        trackingUpdates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTrackingUpdates({
        orderId: '',
        location: '',
        trackingStatus: ''
      });
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tracking.');
    }
  };

  // Product Management
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const createProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(
        "http://localhost:5000/api/admin/products",
        newProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewProduct({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
      });
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    }
  };

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

  const startEditingProduct = (product) => {
    setEditingProduct(product);
  };

  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

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

  // Agent Withdrawal
  const handleWithdrawalInputChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalData(prev => ({ ...prev, [name]: value }));
  };

  const processWithdrawal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(
        "http://localhost:5000/api/admin/withdraw",
        withdrawalData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWithdrawalData({
        agentId: '',
        amount: ''
      });
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process withdrawal.');
    }
  };

  // Make Admin
  const handleMakeAdmin = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      await axios.post(
        "http://localhost:5000/api/admin/make-admin",
        { email: adminEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdminEmail('');
      refreshData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make user admin.');
    }
  };

  // Delete skincare form
  const deleteSkinCareForm = async (formId) => {
    const token = localStorage.getItem('adminToken');
    if (window.confirm("Are you sure you want to delete this form submission?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/skincare-forms/${formId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSkinCareForms(prev => prev.filter(form => form._id !== formId));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete skin care form.');
      }
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
        <button
          className={activeTab === 'agents' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('agents')}
        >
          Agents
        </button>
        <button
          className={activeTab === 'admin' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('admin')}
        >
          Admin Tools
        </button>
        <button
          className={activeTab === 'skincare' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('skincare')}
        >
          Skincare Forms
        </button>
      </div>

      <div className="content">
        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="section">
            <h2>Users</h2>
            {users.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Update Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr>
                        <td>{order._id}</td>
                        <td>₹{order.totalAmount}</td>
                        <td>{order.status}</td>
                        <td>
                          <select
                            value={orderStatusChanges[order._id] || order.status}
                            onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => updateOrderStatus(order._id)}>Update</button>
                        </td>
                        <td>
                          <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={trackingUpdates.orderId === order._id ? trackingUpdates.location : ''}
                            onChange={(e) =>
                              setTrackingUpdates((prev) => ({
                                ...prev,
                                orderId: order._id,
                                location: e.target.value,
                              }))
                            }
                          />
                          <select
                            name="trackingStatus"
                            value={trackingUpdates.orderId === order._id ? trackingUpdates.trackingStatus : ''}
                            onChange={(e) =>
                              setTrackingUpdates((prev) => ({
                                ...prev,
                                orderId: order._id,
                                trackingStatus: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => updateTracking(order._id)}>Update Tracking</button>
                        </td>
                      </tr>

                      {/* Extra Details Row */}
                      <tr>
                        <td colSpan="5">
                          <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
                            <p><strong>User:</strong> {order.user?.name} ({order.user?.email})</p>
                            <p><strong>Phone:</strong> {order.phone}</p>
                            <p><strong>Address:</strong> {order.address}, Pincode: {order.pincode}</p>
                            <p><strong>Delivery Time:</strong> {order.deliveryTime}</p>
                            <p><strong>Coupon Code:</strong> {order.couponCode || 'N/A'}</p>
                            <p><strong>Discount Applied:</strong> ₹{order.discountApplied || 0}</p>
                            {order.referencedAgent && (
                              <p><strong>Agent:</strong> {order.referencedAgent.name} ({order.referencedAgent.email})</p>
                            )}
                            <p><strong>Products:</strong></p>
                            <ul>
                              {order.product.map((item, index) => (
                                <li key={index}>
                                  {item.product?.name || 'Unknown'} — Quantity: {item.quantity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="section">
            <h2>Products</h2>
            
            {/* Create Product Form */}
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

            {/* Edit Product Form */}
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

            {/* Products List */}
            {products.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <button onClick={() => startEditingProduct(product)}>
                          Edit
                        </button>
                        <button onClick={() => deleteProduct(product._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}

        {/* AGENTS TAB */}
        {activeTab === 'agents' && (
          <div className="section">
            <h2>Agent Management</h2>
            
            <div className="sub-sections">
              <div className="sub-section">
                <h3>Agent Orders</h3>
                {agentOrders.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Agent</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentOrders.map((order) => (
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.agentId?.name || 'N/A'}</td>
                          <td>${order.total}</td>
                          <td>{order.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No agent orders found.</p>
                )}
              </div>

              <div className="sub-section">
                <h3>Agent Withdrawal</h3>
                <form onSubmit={processWithdrawal} className="withdrawal-form">
                  <input
                    type="text"
                    name="agentId"
                    placeholder="Agent ID"
                    value={withdrawalData.agentId}
                    onChange={handleWithdrawalInputChange}
                    required
                  />
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={withdrawalData.amount}
                    onChange={handleWithdrawalInputChange}
                    required
                  />
                  <button type="submit">Process Withdrawal</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* SKIN CARE FORMS TAB
        {activeTab === 'skincare' && (
          <div className="section">
            <h2>Skin Care Form Submissions</h2>
            <button onClick={refreshSkinCareForms} className="refresh-button">
              Refresh Forms
            </button>

            {skinCareForms.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Skin Type</th>
                    <th>Concerns</th>
                    <th>Image</th>
                    <th>Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {skinCareForms.map((form) => (
                    <tr key={form._id}>
                      <td>{form.name}</td>
                      <td>{form.email}</td>
                      <td>{form.age}</td>
                      <td>{form.skinType}</td>
                      <td>{form.concerns?.join(', ') || 'None'}</td>
                      <td>
                        {form.images && form.images.length > 0 ? (
                          <img
                            src={form.images[0]}
                            alt="Skin Care Submission"
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td>{new Date(form.submittedAt).toLocaleString()}</td>
                      <td>
                        <button onClick={() => {
                          alert(`Details for ${form.name}:\n${JSON.stringify(form, null, 2)}`);
                        }}>
                          View Details
                        </button>
                        <button onClick={() => deleteSkinCareForm(form._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No skin care form submissions yet.</p>
            )}
          </div>
        )} */}
        {/* SKIN CARE FORMS TAB */}
        {/* {activeTab === 'skincare' && (
  <div className="section">
    <h2>Skin Care Form Submissions</h2>
    <button onClick={refreshSkinCareForms} className="refresh-button">
      Refresh Forms
    </button>

    {skinCareForms.length > 0 ? (
      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Age</th><th>Skin Type</th><th>Concerns</th><th>Image</th><th>Submitted</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {skinCareForms.map((form) => [
            <tr key={form._id || form.email}>
              <td>{form.name || 'N/A'}</td>
              <td>{form.email || 'N/A'}</td>
              <td>{form.age || 'N/A'}</td>
              <td>{form.skinType || 'Not specified'}</td>
              <td>{form.concerns?.join(', ') || 'None'}</td>
              <td>
                {form.images?.[0] ? (
                  <img
                    src={form.images[0].startsWith('http') ? form.images[0] : `http://localhost:5000/api/admin/skincare-forms/${form.images[0]}`}
                    alt={`Skin submission by ${form.name}`}
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      objectFit: 'cover', 
                      borderRadius: '4px' 
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-.jpg';
                    }}
                  />
                ) : 'No Image'}
              </td>
              <td>
                {form.submittedAt 
                  ? new Date(form.submittedAt).toLocaleString() 
                  : 'Date not available'}
              </td>
              <td className="action-buttons">
                <button 
                  onClick={() => {
                    alert(`Details for ${form.name}:\n${JSON.stringify(form, null, 2)}`);
                  }}
                  className="view-btn"
                >
                  View Details
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete ${form.name}'s submission?`)) {
                      deleteSkinCareForm(form._id);
                    }
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ])}
        </tbody>
      </table>
    ) : (
      <p>No skin care form submissions yet.</p>
    )}
  </div>
)} */}
{activeTab === 'skincare' && (
  <div className="section">
    <h2>Skin Care Form Submissions</h2>
    <button onClick={refreshSkinCareForms} className="refresh-button">
      Refresh Forms
    </button>

    {skinCareForms.length > 0 ? (
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Skin Type</th>
            <th>Concerns</th>
            <th>Image</th>
            <th>Submitted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skinCareForms.map((form) => (
            <tr key={form._id || form.email}>
              <td>{form.name}</td>
              <td>{form.email}</td>
              <td>{form.age}</td>
              <td>{form.skinType}</td>
              <td>{form.concerns?.join(', ') || 'None'}</td>
              <td>
                {form.images?.[0] ? (
                  <img
                    src={
                      form.images[0].startsWith('http')
                        ? form.images[0]
                        : `http://localhost:5000/api/admin/skincare-forms/${form.images[0]}`
                    }
                    alt="skin"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/placeholder-uploads.jpg';
                    }}
                  />
                ) : (
                  'No Image'
                )}
              </td>
              <td>{form.submittedAt ? new Date(form.submittedAt).toLocaleString() : 'Date not available'}</td>
              <td>
                <button onClick={() => alert(JSON.stringify(form, null, 2))}>View Details</button>
                <button onClick={() => deleteSkinCareForm(form._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No skin care form submissions yet.</p>
    )}
  </div>
)}

        {/* ADMIN TOOLS TAB */}
        {activeTab === 'admin' && (
          <div className="section">
            <h2>Admin Tools</h2>
            
            <div className="admin-tool">
              <h3>Make User Admin</h3>
              <form onSubmit={handleMakeAdmin} className="admin-form">
                <input
                  type="email"
                  placeholder="User Email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
                <button type="submit">Make Admin</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;