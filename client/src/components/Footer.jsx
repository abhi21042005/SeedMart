import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <h3>🌱 SeedMart</h3>
            <p>
              Empowering farmers with quality seeds and fertilizers.
              Direct from trusted sellers to your farm.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/marketplace?category=seeds">Seeds</Link>
            <Link to="/marketplace?category=fertilizers">Fertilizers</Link>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p><FiMail size={14} /> support@seedmart.com</p>
            <p><FiPhone size={14} /> +91 98765 43210</p>
            <p><FiMapPin size={14} /> New Delhi, India</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SeedMart. All rights reserved.</p>
          <p>Built for Indian Farmers 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
