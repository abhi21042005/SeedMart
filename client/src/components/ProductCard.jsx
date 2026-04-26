import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product, onWishlistToggle, isWishlisted = false }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please sign in to add items to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Failed to add to cart');
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please sign in to use wishlist');
      return;
    }
    if (onWishlistToggle) onWishlistToggle(product._id);
  };

  const averageRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || product.reviews?.length || 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card card" id={`product-${product._id}`}>
      <div className="product-card-image">
        <img
          src={product.image || '/uploads/default-product.png'}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/1B4332/FEFAE0?text=${encodeURIComponent(product.name?.split(' ')[0] || 'Product')}`;
          }}
        />
        <span className={`badge badge-${product.category}`}>
          {product.category}
        </span>
        <button
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={handleWishlist}
          title="Toggle wishlist"
        >
          <FiHeart size={18} />
        </button>
        {product.stock <= 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>

      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">
          {product.description?.substring(0, 80)}{product.description?.length > 80 ? '...' : ''}
        </p>

        <div className="product-card-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                size={14}
                className={star <= Math.round(averageRating) ? '' : 'star-empty'}
                fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="rating-count">({reviewCount})</span>
        </div>

        <div className="product-card-footer">
          <span className="product-card-price">₹{product.price?.toLocaleString('en-IN')}</span>
          <button
            className="btn btn-primary btn-sm add-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <FiShoppingCart size={14} />
            {product.stock > 0 ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
