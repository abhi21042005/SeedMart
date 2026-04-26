import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiExternalLink } from 'react-icons/fi';
import { getUserOrders } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getUserOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="page-wrapper"><Loader size="full" /></div>;
  if (error) return <div className="page-wrapper container"><ErrorMessage message={error} /></div>;

  return (
    <div className="orders-page page-wrapper">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon"><FiPackage size={48} /></div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders.</p>
            <Link to="/marketplace" className="btn btn-primary mt-4">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card card">
                <div className="order-header">
                  <div className="order-meta">
                    <div>
                      <span className="order-label">Order Placed</span>
                      <span className="order-value">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="order-label">Total</span>
                      <span className="order-value">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="order-label">Order #</span>
                      <span className="order-value">{order._id}</span>
                    </div>
                  </div>
                  <span className={`badge badge-${order.status}`}>{order.status}</span>
                </div>

                <div className="order-body">
                  <div className="order-items-list">
                    {order.items.map((item) => (
                      <div key={item._id} className="order-item">
                        <img src={item.image || '/uploads/default-product.png'} alt={item.name} />
                        <div className="order-item-info">
                          <Link to={`/product/${item.productId}`} className="order-item-name">{item.name}</Link>
                          <p className="order-item-qty">Qty: {item.quantity}</p>
                          <p className="order-item-price">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        <Link to={`/product/${item.productId}`} className="btn btn-secondary btn-sm" style={{ alignSelf: 'center' }}>
                          <FiExternalLink /> View
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
