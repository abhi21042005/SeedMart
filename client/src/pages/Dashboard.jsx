import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiShoppingBag } from 'react-icons/fi';
import { getSellerProducts, getSellerOrders, getAllOrders, createProduct, updateProduct, deleteProduct, updateOrderStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', category: 'seeds', stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordRes] = await Promise.all([
        getSellerProducts(),
        isAdmin ? getAllOrders() : getSellerOrders()
      ]);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const openForm = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData({
        name: product.name, price: product.price, description: product.description,
        category: product.category, stock: product.stock
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', description: '', category: 'seeds', stock: '' });
    }
    setImageFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      setSubmitting(true);
      if (editingId) {
        await updateProduct(editingId, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Order status updated');
      fetchData();
    } catch {
      toast.error('Status update failed');
    }
  };

  if (loading) return <div className="page-wrapper"><Loader size="full" /></div>;

  return (
    <div className="dashboard-page page-wrapper">
      <div className="container">
        <div className="dashboard-header">
          <h1>{isAdmin ? 'Admin Dashboard' : 'Seller Dashboard'}</h1>
          <p>Welcome back, {user.name}</p>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <FiPackage /> Products ({products.length})
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <FiShoppingBag /> Orders ({orders.length})
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h2>My Products</h2>
              <button className="btn btn-primary" onClick={() => openForm()}><FiPlus /> Add Product</button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="product-form card">
                <h3>{editingId ? 'Edit Product' : 'New Product'}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                      <option value="seeds">Seeds</option>
                      <option value="fertilizers">Fertilizers</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" />
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            )}

            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <div className="table-product">
                          <img src={p.image} alt={p.name} onError={e => { e.target.src = 'https://placehold.co/50x50'; }} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td style={{textTransform: 'capitalize'}}>{p.category}</td>
                      <td>₹{p.price}</td>
                      <td>{p.stock}</td>
                      <td>
                        <div className="table-actions">
                          <button className="action-btn edit" onClick={() => openForm(p)}><FiEdit2 /></button>
                          <button className="action-btn delete" onClick={() => handleDelete(p._id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan="5" className="text-center">No products found. Add one above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h2>{isAdmin ? 'All Orders' : 'Customer Orders'}</h2>
            </div>
            
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{o._id.substring(o._id.length - 6)}</td>
                      <td>{o.userId?.name || 'Unknown'}</td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>₹{o.totalPrice}</td>
                      <td><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                      <td>
                        <select 
                          value={o.status} 
                          onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan="6" className="text-center">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
