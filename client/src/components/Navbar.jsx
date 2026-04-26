import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiHeart, FiPackage, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="#1B4332"/>
              <path d="M16 6C16 6 8 14 8 19C8 23.4 11.6 27 16 27C20.4 27 24 23.4 24 19C24 14 16 6 16 6Z" fill="#52B788"/>
              <path d="M16 12V23" stroke="#D4A373" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 15L12 12" stroke="#D4A373" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M16 19L20 16" stroke="#D4A373" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">SeedMart</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link" id="nav-home">Home</Link>
          <Link to="/marketplace" className="nav-link" id="nav-marketplace">Marketplace</Link>
          {isAuthenticated && (
            <Link to="/orders" className="nav-link" id="nav-orders">
              <FiPackage size={16} /> Orders
            </Link>
          )}
          {(isSeller || isAdmin) && (
            <Link to="/dashboard" className="nav-link" id="nav-dashboard">
              <FiGrid size={16} /> Dashboard
            </Link>
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-actions">
          {isAuthenticated && (
            <>
              <Link to="/wishlist" className="nav-icon-btn" id="nav-wishlist" title="Wishlist">
                <FiHeart size={20} />
              </Link>
              <Link to="/cart" className="nav-icon-btn cart-btn" id="nav-cart" title="Cart">
                <FiShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <div className="profile-menu">
              <button
                className="profile-trigger"
                id="profile-menu-trigger"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profile-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="profile-name">{user.name}</span>
              </button>

              {profileOpen && (
                <div className="profile-dropdown animate-fade-in" id="profile-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-role">{user.role}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout} id="logout-btn">
                    <FiLogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Join Free</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="mobile-toggle"
            id="mobile-menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu animate-fade-in" id="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/marketplace" className="mobile-link" onClick={() => setMobileOpen(false)}>Marketplace</Link>
          {isAuthenticated && (
            <>
              <Link to="/cart" className="mobile-link" onClick={() => setMobileOpen(false)}>
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              <Link to="/wishlist" className="mobile-link" onClick={() => setMobileOpen(false)}>Wishlist</Link>
              <Link to="/orders" className="mobile-link" onClick={() => setMobileOpen(false)}>Orders</Link>
            </>
          )}
          {(isSeller || isAdmin) && (
            <Link to="/dashboard" className="mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
          )}
          {isAuthenticated ? (
            <button className="mobile-link mobile-logout" onClick={handleLogout}>Sign Out</button>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileOpen(false)}>Sign In</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileOpen(false)}>Join Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
