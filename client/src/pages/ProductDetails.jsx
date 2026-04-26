import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiPackage, FiUser, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import { getProductById, getProductReviews, toggleWishlist } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { toast } from 'react-toastify';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, revRes] = await Promise.all([
          getProductById(id),
          getProductReviews(id),
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data.reviews || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.info('Please sign in first'); return; }
    try {
      await addToCart(product._id, quantity);
      toast.success(`Added ${quantity}x ${product.name} to cart`);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.info('Please sign in first'); return; }
    try {
      const { data } = await toggleWishlist(product._id);
      toast.success(data.message);
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReviewAdded = (data) => {
    setReviews(data.reviews || []);
  };

  if (loading) return <div className="page-wrapper"><Loader size="full" /></div>;
  if (error) return <div className="page-wrapper container"><ErrorMessage message={error} /></div>;
  if (!product) return null;

  const avgRating = product.averageRating || 0;

  return (
    <div className="product-details-page page-wrapper">
      <div className="container">
        <Link to="/marketplace" className="back-link"><FiArrowLeft /> Back to Marketplace</Link>

        <div className="pd-grid">
          {/* Image */}
          <div className="pd-image-section">
            <div className="pd-image-wrapper">
              <img src={product.image} alt={product.name} onError={e => { e.target.src = `https://placehold.co/600x500/1B4332/FEFAE0?text=${encodeURIComponent(product.name?.split(' ')[0])}`; }} />
              <span className={`badge badge-${product.category}`}>{product.category}</span>
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <h1>{product.name}</h1>

            <div className="pd-meta">
              <div className="stars">
                {[1,2,3,4,5].map(s => <FiStar key={s} size={18} fill={s <= Math.round(avgRating) ? 'currentColor' : 'none'} className={s <= Math.round(avgRating) ? '' : 'star-empty'} />)}
              </div>
              <span>{avgRating} ({reviews.length} reviews)</span>
              <span><FiUser size={14} /> {product.sellerId?.name || 'Seller'}</span>
            </div>

            <p className="pd-price">₹{product.price?.toLocaleString('en-IN')}</p>

            <p className="pd-description">{product.description}</p>

            <div className="pd-stock">
              <FiPackage size={16} />
              {product.stock > 0 ? <span className="in-stock">{product.stock} in stock</span> : <span className="out-stock">Out of stock</span>}
            </div>

            {product.stock > 0 && (
              <div className="pd-actions">
                <div className="qty-selector">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><FiMinus /></button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><FiPlus /></button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} id="add-to-cart-btn">
                  <FiShoppingCart size={18} /> Add to Cart
                </button>
                <button className="btn btn-secondary" onClick={handleWishlist} id="wishlist-toggle">
                  <FiHeart size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="pd-reviews" id="reviews-section">
          <h2>Customer Reviews</h2>
          {isAuthenticated && <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />}
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
