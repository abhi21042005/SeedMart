import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useState } from 'react';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, cartTotal, fetchCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateQty = async (productId, currentQty, delta, stock) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    if (newQty > stock) {
      toast.warning(`Only ${stock} items available in stock`);
      return;
    }
    await updateQuantity(productId, newQty);
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const { data } = await createOrder();
      toast.success('Order placed successfully!');
      await fetchCart(); // refresh cart state
      navigate('/orders');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <div className="page-wrapper"><Loader size="full" /></div>;

  if (!cart?.items?.length) {
    return (
      <div className="cart-page page-wrapper">
        <div className="container cart-empty">
          <div className="empty-icon"><FiShoppingBag size={48} /></div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/marketplace" className="btn btn-primary btn-lg mt-4">
            Start Shopping <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-wrapper">
      <div className="container">
        <h1 className="cart-title">Shopping Cart</h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => {
              const product = item.productId;
              if (!product) return null; // product was deleted

              return (
                <div key={item._id} className="cart-item">
                  <Link to={`/product/${product._id}`} className="cart-item-img">
                    <img src={product.image} alt={product.name} onError={e => { e.target.src = `https://placehold.co/200x200/1B4332/FEFAE0?text=IMG`; }} />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/product/${product._id}`} className="cart-item-name">{product.name}</Link>
                    <p className="cart-item-price">₹{product.price?.toLocaleString('en-IN')}</p>
                    {product.stock < 5 && product.stock > 0 && <p className="stock-warning">Only {product.stock} left!</p>}
                    {product.stock <= 0 && <p className="stock-error">Out of stock</p>}
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-selector">
                      <button onClick={() => handleUpdateQty(product._id, item.quantity, -1, product.stock)} disabled={item.quantity <= 1}><FiMinus /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleUpdateQty(product._id, item.quantity, 1, product.stock)} disabled={item.quantity >= product.stock}><FiPlus /></button>
                    </div>
                    <button className="cart-item-remove" onClick={() => removeFromCart(product._id)}>
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="cart-actions">
              <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
              <Link to="/marketplace" className="btn btn-secondary btn-sm">Continue Shopping</Link>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cart.items.reduce((a,c) => a + c.quantity, 0)} items)</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button 
              className="btn btn-primary btn-lg checkout-btn" 
              onClick={handleCheckout} 
              disabled={checkoutLoading || cart.items.some(i => i.productId?.stock < i.quantity)}
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            {cart.items.some(i => i.productId?.stock < i.quantity) && (
              <p className="summary-error mt-2">Some items are out of stock. Please remove or reduce quantity to checkout.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
