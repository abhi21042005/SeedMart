import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiStar, FiUsers } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    window.dispatchEvent(new Event('open-chatbot'));
  };

  const handleScrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await getProducts({ limit: 8 });
        setFeaturedProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        <div className="container hero-content">
          <div className="hero-text animate-fade-in-up">
            <span className="hero-badge">🌾 Trusted by 10,000+ Farmers</span>
            <h1>Quality Seeds & Fertilizers,<br /><span className="hero-highlight">Delivered to Your Farm</span></h1>
            <p className="hero-desc">
              India's premier agricultural marketplace connecting farmers directly with
              verified sellers. Get the best seeds, fertilizers, and expert crop recommendations.
            </p>
            <div className="hero-actions">
              <Link to="/marketplace" className="btn btn-accent btn-lg" id="hero-cta">
                Browse Marketplace <FiArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg" id="hero-register">
                Join as Seller
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>500+</strong>
                <span>Products</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>200+</strong>
                <span>Sellers</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>15+</strong>
                <span>Crops Supported</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fade-in">
            <div className="hero-card hero-card-1" onClick={() => navigate('/marketplace?category=seeds')} style={{cursor: 'pointer'}}>
              <span className="hero-card-emoji">🌱</span>
              <p>Premium Seeds</p>
            </div>
            <div className="hero-card hero-card-2" onClick={() => navigate('/marketplace?category=fertilizers')} style={{cursor: 'pointer'}}>
              <span className="hero-card-emoji">🧪</span>
              <p>Quality Fertilizers</p>
            </div>
            <div className="hero-card hero-card-3" onClick={handleChatbotClick} style={{cursor: 'pointer'}}>
              <span className="hero-card-emoji">🤖</span>
              <p>AI Crop Advisor</p>
            </div>
            <div className="hero-card hero-card-4" onClick={handleScrollToFeatures} style={{cursor: 'pointer'}}>
              <span className="hero-card-emoji">🚚</span>
              <p>Fast Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section container" id="categories-section">
        <div className="section-title">
          <h2>Shop by Category</h2>
          <p>Find exactly what your crops need</p>
        </div>
        <div className="categories-grid">
          <Link to="/marketplace?category=seeds" className="category-card category-seeds" id="category-seeds">
            <div className="category-icon">🌱</div>
            <h3>Seeds</h3>
            <p>Premium quality seeds for all seasons — hybrid, organic, and high-yield varieties</p>
            <span className="category-link">
              Browse Seeds <FiArrowRight />
            </span>
          </Link>
          <Link to="/marketplace?category=fertilizers" className="category-card category-fertilizers" id="category-fertilizers">
            <div className="category-icon">🧪</div>
            <h3>Fertilizers</h3>
            <p>Chemical & organic fertilizers — NPK, DAP, Urea, micronutrients, and more</p>
            <span className="category-link">
              Browse Fertilizers <FiArrowRight />
            </span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" id="features-section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose SeedMart?</h2>
            <p>We're built for Indian farmers, by agricultural experts</p>
          </div>
          <div className="features-grid">
            <div className="feature-card" onClick={() => navigate('/marketplace')} style={{ cursor: 'pointer' }}>
              <div className="feature-icon"><FiShield size={28} /></div>
              <h3>Verified Sellers</h3>
              <p>Every seller is verified for quality and authenticity. Shop with confidence.</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/marketplace')} style={{ cursor: 'pointer' }}>
              <div className="feature-icon"><FiTruck size={28} /></div>
              <h3>Pan-India Delivery</h3>
              <p>Free delivery across India. Track your orders from warehouse to doorstep.</p>
            </div>
            <div className="feature-card" onClick={handleChatbotClick} style={{ cursor: 'pointer' }}>
              <div className="feature-icon"><FiStar size={28} /></div>
              <h3>AI Crop Advisor</h3>
              <p>Get personalized seed and fertilizer recommendations for your specific crops.</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/marketplace')} style={{ cursor: 'pointer' }}>
              <div className="feature-icon"><FiUsers size={28} /></div>
              <h3>Community Reviews</h3>
              <p>Real reviews from real farmers. Make informed decisions before buying.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container" id="featured-section">
        <div className="section-title">
          <h2>Featured Products</h2>
          <p>Top-rated seeds and fertilizers from trusted sellers</p>
        </div>

        {loading ? (
          <Loader text="Loading products..." />
        ) : featuredProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <Link to="/marketplace" className="btn btn-primary btn-lg" id="view-all-products">
                View All Products <FiArrowRight size={18} />
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
            <p>No products available yet. Be the first seller to list products!</p>
            <Link to="/register" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Become a Seller
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Grow Better Crops?</h2>
            <p>Join thousands of farmers who trust SeedMart for their agricultural needs.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-accent btn-lg">
                Get Started Free <FiArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
