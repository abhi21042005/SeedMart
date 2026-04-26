function renderNavbar() {
  const root = document.getElementById('navbar-root');
  if (!root) return;

  const authLinks = Auth.isAuthenticated ? `
    <div class="nav-user-menu">
      <span class="nav-greeting">Hi, ${Auth.user.name.split(' ')[0]}</span>
      ${Auth.isSeller || Auth.isAdmin ? `
        <a href="dashboard.html" class="nav-link">Dashboard</a>
      ` : ''}
      <a href="orders.html" class="nav-link">Orders</a>
      <a href="wishlist.html" class="nav-link">Wishlist</a>
      <button onclick="Auth.logout()" class="btn btn-secondary btn-sm" style="margin-left: 10px;">Logout</button>
    </div>
  ` : `
    <div class="nav-auth-links">
      <a href="login.html" class="nav-link">Log In</a>
      <a href="register.html" class="btn btn-primary btn-sm">Sign Up</a>
    </div>
  `;

  root.innerHTML = `
    <nav class="navbar">
      <div class="container navbar-container">
        <a href="index.html" class="navbar-logo">
          <span class="logo-icon">🌱</span>
          <span class="logo-text">SeedMart</span>
        </a>
        
        <div class="navbar-links">
          <a href="index.html" class="nav-link">Home</a>
          <a href="marketplace.html" class="nav-link">Marketplace</a>
        </div>

        <div class="navbar-actions">
          <a href="cart.html" class="nav-cart" aria-label="Shopping Cart">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span class="cart-badge" id="cart-badge">0</span>
          </a>
          ${authLinks}
        </div>
      </div>
    </nav>
  `;

  // Sync cart badge
  Cart.subscribe((cartData) => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const count = cartData.items?.reduce((a, c) => a + c.quantity, 0) || 0;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}

function renderFooter() {
  const root = document.getElementById('footer-root');
  if (!root) return;

  root.innerHTML = `
    <footer class="footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="footer-logo">
            <span>🌱</span> SeedMart
          </a>
          <p class="footer-desc">
            Empowering Indian farmers with direct access to high-quality agricultural products.
          </p>
        </div>
        <div class="footer-links">
          <h4>Shop</h4>
          <ul>
            <li><a href="marketplace.html?category=seeds">Seeds</a></li>
            <li><a href="marketplace.html?category=fertilizers">Fertilizers</a></li>
            <li><a href="marketplace.html">All Products</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Shipping Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>&copy; 2026 SeedMart. All rights reserved.</p>
      </div>
    </footer>
  `;
}

// Run on load
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
});
