document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('featured-products-container');
  
  try {
    const { products } = await fetchApi('/products?limit=8');
    
    if (!products || products.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--color-text-muted); grid-column: 1/-1;">
          <p>No products available yet. Be the first seller to list products!</p>
          <a href="register.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Become a Seller</a>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(product => `
      <a href="product.html?id=${product._id}" class="product-card card">
        <div class="product-card-image">
          <img src="${product.image || 'https://placehold.co/400x300/1B4332/FEFAE0?text=Product'}" alt="${product.name}" loading="lazy" />
          <span class="badge badge-${product.category}">${product.category}</span>
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
              ${product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
      </a>
    `).join('');
  } catch (error) {
    container.innerHTML = `
      <div style="padding: 2rem; grid-column: 1/-1; text-align: center; color: var(--color-error);">
        Failed to load featured products.
      </div>
    `;
  }
});
