document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.isAuthenticated) {
    window.location.href = 'login.html';
    return;
  }

  const container = document.getElementById('wishlist-container');
  let wishlist = [];

  async function fetchWishlist() {
    try {
      const data = await fetchApi('/wishlist');
      wishlist = data.products || [];
      renderWishlist();
    } catch (e) {
      container.innerHTML = `<div style="text-align: center; color: var(--color-error); padding: 2rem;">Failed to load wishlist</div>`;
    }
  }

  window.removeWishlist = async (e, productId) => {
    e.preventDefault();
    try {
      await fetchApi(`/wishlist/${productId}`, { method: 'POST' });
      wishlist = wishlist.filter(p => p._id !== productId);
      renderWishlist();
      showToast('Removed from wishlist', 'success');
    } catch (err) {
      showToast('Failed to remove', 'error');
    }
  };

  function renderWishlist() {
    if (wishlist.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">♥</div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you like to your wishlist to buy them later.</p>
          <a href="marketplace.html" class="btn btn-primary mt-4">Browse Products</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="product-grid">
        ${wishlist.map(product => `
          <a href="product.html?id=${product._id}" class="product-card card">
            <div class="product-card-image">
              <img src="${product.image || 'https://placehold.co/400'}" alt="${product.name}">
              <span class="badge badge-${product.category}">${product.category}</span>
              <button class="wishlist-btn wishlisted" onclick="window.removeWishlist(event, '${product._id}')" title="Remove">♥</button>
              ${product.stock <= 0 ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
            </div>
            <div class="product-card-body">
              <h3 class="product-card-name">${product.name}</h3>
              <p class="product-card-desc">${product.description?.substring(0, 80)}...</p>
              <div class="product-card-rating">
                <span class="rating-count">★ ${product.averageRating || 0} (${product.reviewCount || product.reviews?.length || 0})</span>
              </div>
              <div class="product-card-footer">
                <span class="product-card-price">₹${product.price?.toLocaleString('en-IN')}</span>
                <button class="btn btn-primary btn-sm add-cart-btn" onclick="event.preventDefault(); Cart.add('${product._id}', 1)" ${product.stock <= 0 ? 'disabled' : ''}>
                  ${product.stock > 0 ? 'Add' : 'Sold Out'}
                </button>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }

  fetchWishlist();
});
