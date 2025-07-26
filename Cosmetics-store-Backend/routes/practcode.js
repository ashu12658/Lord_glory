// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './admin.css';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // States for product management
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: '',
//     stock: '',
//     description: '',
//     category: '',
//     image: ''
//   });
//   const [editingProduct, setEditingProduct] = useState(null); // Current product being edited

//   // State for order status changes; maps orderId to the new status
//   const [orderStatusChanges, setOrderStatusChanges] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('adminToken');
//       if (!token) {
//         setError('No token found. Please log in.');
//         navigate('/admin-login');
//         return;
//       }

//       try {
//         const [usersResponse, ordersResponse, productsResponse] = await Promise.all([
//           axios.get("http://localhost:5000/api/admin/users", {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           axios.get("http://localhost:5000/api/admin/orders", {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           axios.get("http://localhost:5000/api/admin/products", {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         setUsers(usersResponse.data);
//         setOrders(ordersResponse.data);
//         setProducts(productsResponse.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch data.');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // Refresh orders and products data after a change
//   const refreshData = async () => {
//     const token = localStorage.getItem('adminToken');
//     try {
//       const [ordersResponse, productsResponse] = await Promise.all([
//         axios.get("http://localhost:5000/api/admin/orders", {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get("http://localhost:5000/api/admin/products", {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);
//       setOrders(ordersResponse.data);
//       setProducts(productsResponse.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to refresh data.');
//     }
//   };

//   // --------------------
//   // ORDER MANAGEMENT
//   // --------------------

//   // Record local changes for an order's status
//   const handleOrderStatusChange = (orderId, newStatus) => {
//     setOrderStatusChanges(prev => ({ ...prev, [orderId]: newStatus }));
//   };

//   // Call backend endpoint to update order status
//   const updateOrderStatus = async (orderId) => {
//     const token = localStorage.getItem('adminToken');
//     const newStatus = orderStatusChanges[orderId];
//     try {
//       await axios.put(
//         `http://localhost:5000/api/orders/${orderId}`,
//         { orderId, status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       // Update local orders state with the new status
//       setOrders(prevOrders =>
//         prevOrders.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
//       );
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update order status.');
//     }
//   };

//   // --------------------
//   // PRODUCT MANAGEMENT
//   // --------------------

//   // Handle input changes for creating a new product
//   const handleProductInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct(prev => ({ ...prev, [name]: value }));
//   };

//   // Create a new product
//   const createProduct = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('adminToken');
//     try {
//       await axios.post(
//         "http://localhost:5000/api/admin/products",
//         newProduct,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNewProduct({
//         name: '',
//         price: '',
//         stock: '',
//         description: '',
//         category: '',
//         image: ''
//       });
//       refreshData();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create product.');
//     }
//   };

//   // Delete an existing product
//   const deleteProduct = async (productId) => {
//     const token = localStorage.getItem('adminToken');
//     try {
//       await axios.delete("http://localhost:5000/:productId", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       refreshData();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to delete product.');
//     }
//   };

//   // Start editing a product by setting it in state
//   const startEditingProduct = (product) => {
//     setEditingProduct(product);
//   };

//   // Handle changes in the edit product form
//   const handleEditProductInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditingProduct(prev => ({ ...prev, [name]: value }));
//   };

//   // Update an existing product
//   const updateProduct = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('adminToken');
//     try {
//       await axios.put(
//         "http://localhost:5000/api/admin/products/:id",
//         editingProduct,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setEditingProduct(null);
//       refreshData();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update product.');
//     }
//   };

//   const updateTracking = async (e)=> {
//     e.preventDefault();
//   const token =localStorage.getItem('adminToken');
//   try {
//     await axios.put(
//       "http://localhost:5000/api/admin/orders/:id",
//       orderStatusChanges,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     setOrderStatusChanges({});
//     refreshData();
//   } catch (err) {
//     setError(err.response?.data?.message || 'Failed to update order status.');
//   }
//   };

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-title">Admin Dashboard</h1>

//       {error && <p className="error-message">{error}</p>}

//       <div className="tabs">
//         <button
//           className={activeTab === 'users' ? 'tab active' : 'tab'}
//           onClick={() => setActiveTab('users')}
//         >
//           Users
//         </button>
//         <button
//           className={activeTab === 'orders' ? 'tab active' : 'tab'}
//           onClick={() => setActiveTab('orders')}
//         >
//           Orders
//         </button>
//         <button
//           className={activeTab === 'products' ? 'tab active' : 'tab'}
//           onClick={() => setActiveTab('products')}
//         >
//           Products
//         </button>
//       </div>

//       <div className="content">
//         {/* USERS TAB */}
//         {activeTab === 'users' && (
//           <div className="section">
//             <h2>Users</h2>
//             {users.length > 0 ? (
//               <ul>
//                 {users.map((user) => (
//                   <li key={user._id} className="item">
//                     <p>
//                       <strong>Name:</strong> {user.name}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {user.email}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No users found.</p>
//             )}
//           </div>
//         )}

//         {/* ORDERS TAB */}
//         {activeTab === 'orders' && (
//           <div className="section">
//             <h2>Orders</h2>
//             {orders.length > 0 ? (
//               <ul>
//                 {orders.map((order) => (
//                   <li key={order._id} className="item">
//                     <p>
//                       <strong>Order ID:</strong> {order._id}
//                     </p>
//                     <p>
//                       <strong>Total:</strong> ${order.total}
//                     </p>
//                     <p>
//                       <strong>Status:</strong> {order.status}
//                     </p>
//                     <div>
//                       <select
//                         value={orderStatusChanges[order._id] || order.status}
//                         onChange={(e) =>
//                           handleOrderStatusChange(order._id, e.target.value)
//                         }
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Processing">Processing</option>
//                         <option value="Shipped">Shipped</option>
//                         <option value="Delivered">Delivered</option>
//                         <option value="Cancelled">Cancelled</option>
//                       </select>
//                       <button onClick={() => updateOrderStatus(order._id)}>
//                         Update Status
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No orders found.</p>
//             )}
//           </div>
//         )}

//         {/* PRODUCTS TAB */}
//         {activeTab === 'products' && (
//           <div className="section">
//             <h2>Products</h2>
//             {/* Form for Creating a New Product */}
//             <form onSubmit={createProduct} className="product-form">
//               <h3>Create New Product</h3>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={newProduct.name}
//                 onChange={handleProductInputChange}
//                 required
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={newProduct.price}
//                 onChange={handleProductInputChange}
//                 required
//               />
//               <input
//                 type="number"
//                 name="stock"
//                 placeholder="Stock"
//                 value={newProduct.stock}
//                 onChange={handleProductInputChange}
//                 required
//               />
//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Description"
//                 value={newProduct.description}
//                 onChange={handleProductInputChange}
//               />
//               <input
//                 type="text"
//                 name="category"
//                 placeholder="Category"
//                 value={newProduct.category}
//                 onChange={handleProductInputChange}
//               />
//               <input
//                 type="text"
//                 name="image"
//                 placeholder="Image URL"
//                 value={newProduct.image}
//                 onChange={handleProductInputChange}
//               />
//               <button type="submit">Create Product</button>
//             </form>

//             {/* Form for Editing a Product */}
//             {editingProduct && (
//               <form onSubmit={updateProduct} className="product-form">
//                 <h3>Edit Product</h3>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Name"
//                   value={editingProduct.name}
//                   onChange={handleEditProductInputChange}
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="price"
//                   placeholder="Price"
//                   value={editingProduct.price}
//                   onChange={handleEditProductInputChange}
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="stock"
//                   placeholder="Stock"
//                   value={editingProduct.stock}
//                   onChange={handleEditProductInputChange}
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="description"
//                   placeholder="Description"
//                   value={editingProduct.description}
//                   onChange={handleEditProductInputChange}
//                 />
//                 <input
//                   type="text"
//                   name="category"
//                   placeholder="Category"
//                   value={editingProduct.category}
//                   onChange={handleEditProductInputChange}
//                 />
//                 <input
//                   type="text"
//                   name="image"
//                   placeholder="Image URL"
//                   value={editingProduct.image}
//                   onChange={handleEditProductInputChange}
//                 />
//                 <button type="submit">Update Product</button>
//                 <button type="button" onClick={() => setEditingProduct(null)}>
//                   Cancel
//                 </button>
//               </form>
//             )}

//             {/* List of Products */}
//             {products.length > 0 ? (
//               <ul>
//                 {products.map((product) => (
//                   <li key={product._id} className="item">
//                     <p>
//                       <strong>Name:</strong> {product.name}
//                     </p>
//                     <p>
//                       <strong>Price:</strong> ${product.price}
//                     </p>
//                     <p>
//                       <strong>Stock:</strong> {product.stock}
//                     </p>
//                     <p>
//                       <strong>Description:</strong> {product.description}
//                     </p>
//                     <div>
//                       <button onClick={() => startEditingProduct(product)}>
//                         Edit
//                       </button>
//                       <button onClick={() => deleteProduct(product._id)}>
//                         Delete
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No products found.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './admin.css';

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState('users');
//   const [users, setUsers] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // States for product management
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     price: '',
//     stock: '',
//     description: '',
//     category: '',
//     image: ''
//   });
//   const [editingProduct, setEditingProduct] = useState(null); // Current product being edited

//   // State for order status changes; maps orderId to the new status
//   const [orderStatusChanges, setOrderStatusChanges] = useState({});
  
//   // State for tracking updates
//   const [trackingUpdate, setTrackingUpdate] = useState({
//     orderId: '',
//     location: '',
//     trackingStatus: ''
//   });
  
//   // State for expanded order details
//   const [expandedOrderId, setExpandedOrderId] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, [navigate]);

//   const fetchData = async () => {
//     const token = localStorage.getItem('adminToken');
//     if (!token) {
//       setError('No token found. Please log in.');
//       navigate('/admin-login');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const [usersResponse, ordersResponse, productsResponse] = await Promise.all([
//         axios.get("http://localhost:5000/api/admin/users", {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get("http://localhost:5000/api/admin/orders", {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         axios.get("http://localhost:5000/api/admin/products", {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       setUsers(usersResponse.data);
//       setOrders(ordersResponse.data);
//       setProducts(productsResponse.data);
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       setError(err.response?.data?.message || 'Failed to fetch data. Please check your server connection.');
//       console.error("API Error:", err);
//     }
//   };

//   // Toggle expanded order details
//   const toggleOrderDetails = (orderId) => {
//     if (expandedOrderId === orderId) {
//       setExpandedOrderId(null);
//     } else {
//       setExpandedOrderId(orderId);
//     }
//   };

//   // Record local changes for an order's status
//   const handleOrderStatusChange = (orderId, newStatus) => {
//     setOrderStatusChanges(prev => ({ ...prev, [orderId]: newStatus }));
//   };

//   // Call backend endpoint to update order status
//   const updateOrderStatus = async (orderId) => {
//     const token = localStorage.getItem('adminToken');
//     const newStatus = orderStatusChanges[orderId];
    
//     if (!newStatus) {
//       return; // No change to update
//     }
    
//     setLoading(true);
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/orders/status`,
//         { id: orderId, status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       // Update local orders state with the new status
//       setOrders(prevOrders =>
//         prevOrders.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
//       );
      
//       // Clear this order's status change from state
//       const updatedChanges = { ...orderStatusChanges };
//       delete updatedChanges[orderId];
//       setOrderStatusChanges(updatedChanges);
      
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       console.error("Update Status Error:", err);
//       setError(err.response?.data?.message || 'Failed to update order status.');
//     }
//   };

//   // Handle tracking update input changes
//   const handleTrackingInputChange = (e) => {
//     const { name, value } = e.target;
//     setTrackingUpdate(prev => ({ ...prev, [name]: value }));
//   };

//   // Update order tracking info
//   const submitTrackingUpdate = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('adminToken');
//     const { orderId, location, trackingStatus } = trackingUpdate;
    
//     if (!orderId || !location || !trackingStatus) {
//       setError('Please fill all tracking update fields');
//       return;
//     }

//     setLoading(true);
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/orders/${orderId}/tracking`,
//         { location, trackingStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setTrackingUpdate({
//         orderId: '',
//         location: '',
//         trackingStatus: ''
//       });
      
//       await fetchData(); // Refresh all data
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       console.error("Tracking Update Error:", err);
//       setError(err.response?.data?.message || 'Failed to update tracking information.');
//     }
//   };

//   // --------------------
//   // PRODUCT MANAGEMENT
//   // --------------------

//   // Handle input changes for creating a new product
//   const handleProductInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct(prev => ({ ...prev, [name]: value }));
//   };

//   // Create a new product
//   const createProduct = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('adminToken');
    
//     setLoading(true);
//     try {
//       await axios.post(
//         "http://localhost:5000/api/admin/products",
//         newProduct,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setNewProduct({
//         name: '',
//         price: '',
//         stock: '',
//         description: '',
//         category: '',
//         image: ''
//       });
      
//       await fetchData(); // Refresh data
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       console.error("Create Product Error:", err);
//       setError(err.response?.data?.message || 'Failed to create product.');
//     }
//   };

//   // Delete an existing product
//   const deleteProduct = async (productId) => {
//     const token = localStorage.getItem('adminToken');
    
//     if (!window.confirm("Are you sure you want to delete this product?")) {
//       return;
//     }
    
//     setLoading(true);
//     try {
//       await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       await fetchData(); // Refresh data
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       console.error("Delete Product Error:", err);
//       setError(err.response?.data?.message || 'Failed to delete product.');
//     }
//   };

//   // Start editing a product by setting it in state
//   const startEditingProduct = (product) => {
//     setEditingProduct({ ...product });
//   };

//   // Handle changes in the edit product form
//   const handleEditProductInputChange = (e) => {
//     const { name, value } = e.target;
//     setEditingProduct(prev => ({ ...prev, [name]: value }));
//   };

//   // Update an existing product
//   const updateProduct = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('adminToken');
    
//     setLoading(true);
//     try {
//       await axios.put(
//         `http://localhost:5000/api/admin/products/${editingProduct._id}`,
//         editingProduct,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       setEditingProduct(null);
//       await fetchData(); // Refresh data
//       setLoading(false);
//     } catch (err) {
//       setLoading(false);
//       console.error("Update Product Error:", err);
//       setError(err.response?.data?.message || 'Failed to update product.');
//     }
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <div className="dashboard-container">
//       <h1 className="dashboard-title">Admin Dashboard</h1>

//       {error && (
//         <div className="error-message">
//           <p>{error}</p>
//           <button onClick={() => setError(null)}>Dismiss</button>
//         </div>
//       )}
      
//       {loading && <div className="loading-indicator">Loading...</div>}

//       <div className="tabs">
//         <button
//           className={activeTab === 'users' ? 'tab active' : 'tab'}
//           onClick={() => setActiveTab('users')}
//         >
//           Users
//         </button>
//         <button
//           className={activeTab === 'orders' ? 'tab active' : 'tab'}
//           onClick={() => setActiveTab('orders')}
//         >
//           Orders
//         </button>
//         <button
//           className={activeTab === 'products' ? 'tab active' : 'tab'}
//           onClick={() => setActiveTab('products')}
//         >
//           Products
//         </button>
//       </div>

//       <div className="content">
//         {/* USERS TAB */}
//         {activeTab === 'users' && (
//           <div className="section">
//             <h2>Users</h2>
//             <button onClick={fetchData} className="refresh-button">Refresh Data</button>
            
//             {users.length > 0 ? (
//               <ul className="user-list">
//                 {users.map((user) => (
//                   <li key={user._id} className="item user-item">
//                     <p>
//                       <strong>Name:</strong> {user.name}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {user.email}
//                     </p>
//                     <p>
//                       <strong>Role:</strong> {user.role || 'customer'}
//                     </p>
//                     <p>
//                       <strong>Created:</strong> {formatDate(user.createdAt)}
//                     </p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No users found.</p>
//             )}
//           </div>
//         )}

//         {/* ORDERS TAB */}
//         {activeTab === 'orders' && (
//           <div className="section">
//             <h2>Orders</h2>
//             <button onClick={fetchData} className="refresh-button">Refresh Data</button>
            
//             {/* Form for tracking updates */}
//             <form onSubmit={submitTrackingUpdate} className="tracking-form">
//               <h3>Add Tracking Update</h3>
//               <select
//                 name="orderId"
//                 value={trackingUpdate.orderId}
//                 onChange={handleTrackingInputChange}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Order</option>
//                 {orders.map(order => (
//                   <option key={order._id} value={order._id}>
//                     {order._id.substring(0, 8)}... - {order.status}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="text"
//                 name="location"
//                 placeholder="Location"
//                 value={trackingUpdate.location}
//                 onChange={handleTrackingInputChange}
//                 required
//                 disabled={loading}
//               />
//               <select
//                 name="trackingStatus"
//                 value={trackingUpdate.trackingStatus}
//                 onChange={handleTrackingInputChange}
//                 required
//                 disabled={loading}
//               >
//                 <option value="">Select Status</option>
//                 <option value="Pending">Pending</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Shipped">Shipped</option>
//                 <option value="Out for Delivery">Out for Delivery</option>
//                 <option value="Delivered">Delivered</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//               <button type="submit" disabled={loading}>Add Tracking Update</button>
//             </form>
            
//             {orders.length > 0 ? (
//               <ul className="order-list">
//                 {orders.map((order) => (
//                   <li key={order._id} className="item order-item">
//                     <div className="order-header" onClick={() => toggleOrderDetails(order._id)}>
//                       <h3>Order #{order._id.substring(0, 8)}...</h3>
//                       <p className={`order-status status-${order.status?.toLowerCase()}`}>
//                         {order.status}
//                       </p>
//                       <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
//                       <p><strong>Total:</strong> ${order.total || order.totalAmount}</p>
//                       <button className="expand-button">
//                         {expandedOrderId === order._id ? "Hide Details" : "Show Details"}
//                       </button>
//                     </div>
                    
//                     {expandedOrderId === order._id && (
//                       <div className="order-details">
//                         <div className="order-info">
//                           <h4>Order Information</h4>
//                           <p><strong>Order ID:</strong> {order._id}</p>
//                           <p><strong>Customer:</strong> {order.user?.name || "N/A"}</p>
//                           <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
//                           <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
//                           <p><strong>Total:</strong> ${order.total || order.totalAmount}</p>
//                           <p><strong>Payment Status:</strong> {order.paymentStatus || "N/A"}</p>
//                           <p><strong>Payment Method:</strong> {order.paymentMethod || "N/A"}</p>
//                         </div>
                        
//                         {order.items && order.items.length > 0 && (
//                           <div className="order-items">
//                             <h4>Ordered Items</h4>
//                             <table>
//                               <thead>
//                                 <tr>
//                                   <th>Product</th>
//                                   <th>Quantity</th>
//                                   <th>Price</th>
//                                   <th>Total</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {order.items.map((item, index) => (
//                                   <tr key={index}>
//                                     <td>{item.product?.name || item.productName || "Unknown Product"}</td>
//                                     <td>{item.quantity}</td>
//                                     <td>${item.price}</td>
//                                     <td>${item.quantity * item.price}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         )}
                        
//                         {order.shippingAddress && (
//                           <div className="shipping-info">
//                             <h4>Shipping Information</h4>
//                             <p><strong>Address:</strong> {order.shippingAddress.street}</p>
//                             <p><strong>City:</strong> {order.shippingAddress.city}</p>
//                             <p><strong>State:</strong> {order.shippingAddress.state}</p>
//                             <p><strong>Zip:</strong> {order.shippingAddress.zip}</p>
//                             <p><strong>Country:</strong> {order.shippingAddress.country}</p>
//                           </div>
//                         )}
                        
//                         <div className="status-update">
//                           <h4>Update Status</h4>
//                           <select
//                             value={orderStatusChanges[order._id] || order.status}
//                             onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
//                             disabled={loading}
//                           >
//                             <option value="Pending">Pending</option>
//                             <option value="Processing">Processing</option>
//                             <option value="Shipped">Shipped</option>
//                             <option value="Delivered">Delivered</option>
//                             <option value="Cancelled">Cancelled</option>
//                           </select>
//                           <button 
//                             onClick={() => updateOrderStatus(order._id)}
//                             disabled={loading || !orderStatusChanges[order._id]}
//                           >
//                             Update Status
//                           </button>
//                         </div>
                        
//                         {/* Display tracking updates if available */}
//                         <div className="tracking-history">
//                           <h4>Tracking History</h4>
//                           {order.trackingUpdates && order.trackingUpdates.length > 0 ? (
//                             <ul>
//                               {order.trackingUpdates.map((update, index) => (
//                                 <li key={index} className="tracking-update">
//                                   <p><strong>Location:</strong> {update.location}</p>
//                                   <p><strong>Status:</strong> {update.trackingStatus}</p>
//                                   <p><strong>Date:</strong> {formatDate(update.updatedAt)}</p>
//                                 </li>
//                               ))}
//                             </ul>
//                           ) : (
//                             <p>No tracking updates available.</p>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No orders found.</p>
//             )}
//           </div>
//         )}

//         {/* PRODUCTS TAB */}
//         {activeTab === 'products' && (
//           <div className="section">
//             <h2>Products</h2>
//             <button onClick={fetchData} className="refresh-button">Refresh Data</button>
            
//             {/* Form for Creating a New Product */}
//             <form onSubmit={createProduct} className="product-form">
//               <h3>Create New Product</h3>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={newProduct.name}
//                 onChange={handleProductInputChange}
//                 required
//                 disabled={loading}
//               />
//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={newProduct.price}
//                 onChange={handleProductInputChange}
//                 required
//                 disabled={loading}
//                 min="0"
//                 step="0.01"
//               />
//               <input
//                 type="number"
//                 name="stock"
//                 placeholder="Stock"
//                 value={newProduct.stock}
//                 onChange={handleProductInputChange}
//                 required
//                 disabled={loading}
//                 min="0"
//               />
//               <textarea
//                 name="description"
//                 placeholder="Description"
//                 value={newProduct.description}
//                 onChange={handleProductInputChange}
//                 disabled={loading}
//               ></textarea>
//               <input
//                 type="text"
//                 name="category"
//                 placeholder="Category"
//                 value={newProduct.category}
//                 onChange={handleProductInputChange}
//                 disabled={loading}
//               />
//               <input
//                 type="text"
//                 name="image"
//                 placeholder="Image URL"
//                 value={newProduct.image}
//                 onChange={handleProductInputChange}
//                 disabled={loading}
//               />
//               <button type="submit" disabled={loading}>Create Product</button>
//             </form>

//             {/* Form for Editing a Product */}
//             {editingProduct && (
//               <form onSubmit={updateProduct} className="product-form edit-form">
//                 <h3>Edit Product</h3>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Name"
//                   value={editingProduct.name}
//                   onChange={handleEditProductInputChange}
//                   required
//                   disabled={loading}
//                 />
//                 <input
//                   type="number"
//                   name="price"
//                   placeholder="Price"
//                   value={editingProduct.price}
//                   onChange={handleEditProductInputChange}
//                   required
//                   disabled={loading}
//                   min="0"
//                   step="0.01"
//                 />
//                 <input
//                   type="number"
//                   name="stock"
//                   placeholder="Stock"
//                   value={editingProduct.stock}
//                   onChange={handleEditProductInputChange}
//                   required
//                   disabled={loading}
//                   min="0"
//                 />
//                 <textarea
//                   name="description"
//                   placeholder="Description"
//                   value={editingProduct.description}
//                   onChange={handleEditProductInputChange}
//                   disabled={loading}
//                 ></textarea>
//                 <input
//                   type="text"
//                   name="category"
//                   placeholder="Category"
//                   value={editingProduct.category}
//                   onChange={handleEditProductInputChange}
//                   disabled={loading}
//                 />
//                 <input
//                   type="text"
//                   name="image"
//                   placeholder="Image URL"
//                   value={editingProduct.image}
//                   onChange={handleEditProductInputChange}
//                   disabled={loading}
//                 />
//                 <div className="form-buttons">
//                   <button type="submit" disabled={loading}>Update Product</button>
//                   <button 
//                     type="button" 
//                     onClick={() => setEditingProduct(null)}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* List of Products */}
//             {products.length > 0 ? (
//               <ul className="product-list">
//                 {products.map((product) => (
//                   <li key={product._id} className="item product-item">
//                     <div className="product-details">
//                       {product.image && (
//                         <div className="product-image">
//                           <img src={product.image} alt={product.name} />
//                         </div>
//                       )}
//                       <div className="product-info">
//                         <h3>{product.name}</h3>
//                         <p><strong>Price:</strong> ${product.price}</p>
//                         <p><strong>Stock:</strong> {product.stock}</p>
//                         <p><strong>Category:</strong> {product.category}</p>
//                         <p><strong>Description:</strong> {product.description}</p>
//                       </div>
//                     </div>
//                     <div className="product-actions">
//                       <button 
//                         onClick={() => startEditingProduct(product)}
//                         disabled={loading}
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         onClick={() => deleteProduct(product._id)}
//                         disabled={loading}
//                         className="delete-button"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No products found.</p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;



import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [agentOrders, setAgentOrders] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // States for commission management
  // const [commissionStatus, setCommissionStatus] = useState({});

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
            axios.get("http://localhost:5000/api/agents/orders", {
              headers: { Authorization: `Bearer ${token}` }
            }),
            // axios.get("http://localhost:5000/api/agent/commissions/:agentId", {
            //   headers: { Authorization: `Bearer ${token}` }
            // })
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
          axios.get("http://localhost:5000/api/agents/orders", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          // axios.get("http://localhost:5000/commissions/:agentId", {
          //   headers: { Authorization: `Bearer ${token}` }
          // })
        ]);
      setOrders(ordersResponse.data);
      setProducts(productsResponse.data);
      setAgentOrders(agentOrdersResponse.data);
      // setCommissions(commissionsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refresh data.');
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

  // Commission Management
  // const handleCommissionStatusChange = (commissionId, status) => {
  //   setCommissionStatus(prev => ({ ...prev, [commissionId]: status }));
  // };

  // const updateCommissionStatus = async (commissionId) => {
  //   const token = localStorage.getItem('adminToken');
  //   try {
  //     await axios.put(
  //       `http://localhost:5000/api/admin/commissions/${commissionId}`,
  //       { status: commissionStatus[commissionId] },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     refreshData();
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to update commission status.');
  //   }
  // };

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
            
            <div className="sub-tabs">
              <button onClick={() => setActiveTab('orders')}>Customer Orders</button>
              <button onClick={() => setActiveTab('agent-orders')}>Agent Orders</button>
            </div>

            {orders.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>${order.total}</td>
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
                        <button onClick={() => updateOrderStatus(order._id)}>
                          Update
                        </button>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="location"
                          placeholder="Location"
                          value={trackingUpdates.orderId === order._id ? trackingUpdates.location : ''}
                          onChange={(e) => {
                            setTrackingUpdates(prev => ({
                              ...prev,
                              orderId: order._id,
                              location: e.target.value
                            }));
                          }}
                        />
                        <select
                          name="trackingStatus"
                          value={trackingUpdates.orderId === order._id ? trackingUpdates.trackingStatus : ''}
                          onChange={(e) => {
                            setTrackingUpdates(prev => ({
                              ...prev,
                              orderId: order._id,
                              trackingStatus: e.target.value
                            }));
                          }}
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={() => updateTracking(order._id)}>
                          Update Tracking
                        </button>
                      </td>
                    </tr>
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

//{/* <div className="sub-section">
                <h3>Commissions</h3>
                {commissions.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Agent</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((commission) => (
                        <tr key={commission._id}>
                          <td>{commission.agentId?.name || 'N/A'}</td>
                          <td>${commission.amount}</td>
                          <td>{commission.status}</td>
                          <td>
                            {commission.status === 'Pending' && (
                              <>
                                <select
                                  value={commissionStatus[commission._id] || ''}
                                  onChange={(e) => handleCommissionStatusChange(commission._id, e.target.value)}
                                >
                                  <option value="">Select Action</option>
                                  <option value="Approved">Approve</option>
                                  <option value="Rejected">Reject</option>
                                </select>
                                <button onClick={() => updateCommissionStatus(commission._id)}>
                                  Submit
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No commissions found.</p>
                )}
              </div> */}

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