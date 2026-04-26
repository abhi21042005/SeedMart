import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getWishlist, toggleWishlist as toggleWishlistApi } from '../services/api';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setWishlist(data.products || []);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (productId) => {
    try {
      await toggleWishlistApi(productId);
      setWishlist(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) return <div className="page-wrapper"><Loader size="full" /></div>;

  return (
    <div className="page-wrapper container">
      <h1 style={{ marginBottom: '2rem' }}>My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon"><FiHeart size={48} /></div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you like to your wishlist to buy them later.</p>
          <Link to="/marketplace" className="btn btn-primary mt-4">Browse Products</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              isWishlisted={true} 
              onWishlistToggle={handleWishlistToggle} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
