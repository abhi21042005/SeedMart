document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').textContent = 'Product ID not provided.';
    document.getElementById('error-state').style.display = 'block';
    return;
  }

  let product = null;
  let reviews = [];
  let quantity = 1;
  let rating = 0;

  const els = {
    container: document.getElementById('product-container'),
    loading: document.getElementById('loading-state'),
    error: document.getElementById('error-state'),
    img: document.getElementById('pd-image'),
    badge: document.getElementById('pd-badge'),
    name: document.getElementById('pd-name'),
    stars: document.getElementById('pd-stars'),
    ratingText: document.getElementById('pd-rating-text'),
    seller: document.getElementById('pd-seller'),
    price: document.getElementById('pd-price'),
    description: document.getElementById('pd-description'),
    stock: document.getElementById('pd-stock-container'),
    actions: document.getElementById('pd-actions-container'),
    qtyValue: document.getElementById('qty-value'),
    qtyMinus: document.getElementById('qty-minus'),
    qtyPlus: document.getElementById('qty-plus'),
    addToCartBtn: document.getElementById('add-to-cart-btn'),
    wishlistBtn: document.getElementById('wishlist-toggle'),
    reviewsSection: document.getElementById('reviews-section'),
    reviewFormContainer: document.getElementById('review-form-container'),
    reviewForm: document.getElementById('review-form'),
    starSelector: document.getElementById('star-selector'),
    reviewComment: document.getElementById('review-comment'),
    submitReview: document.getElementById('submit-review'),
    reviewsList: document.getElementById('reviews-list')
  };

  async function fetchProduct() {
    try {
      const [prodRes, revRes] = await Promise.all([
        fetchApi(`/products/${productId}`),
        fetchApi(`/reviews/${productId}`)
      ]);
      
      product = prodRes;
      reviews = revRes.reviews || [];
      renderProduct();
      renderReviews();
    } catch (e) {
      els.loading.style.display = 'none';
      els.error.textContent = e.message || 'Product not found';
      els.error.style.display = 'block';
    }
  }

  function renderProduct() {
    els.loading.style.display = 'none';
    els.container.style.display = 'grid';
    els.reviewsSection.style.display = 'block';

    document.title = `${product.name} - SeedMart`;

    els.img.src = product.image || 'https://placehold.co/600x500';
    els.img.onerror = () => els.img.src = 'https://placehold.co/600x500';
    
    els.badge.className = `badge badge-${product.category}`;
    els.badge.textContent = product.category;

    els.name.textContent = product.name;
    els.seller.textContent = `By ${product.sellerId?.name || 'Seller'}`;
    els.price.textContent = `₹${product.price?.toLocaleString('en-IN')}`;
    els.description.textContent = product.description;

    // Rating
    const avgRating = product.averageRating || 0;
    els.stars.innerHTML = [1,2,3,4,5].map(s => 
      `<span style="color: ${s <= Math.round(avgRating) ? 'var(--color-accent)' : '#CBD5E0'}">★</span>`
    ).join('');
    els.ratingText.textContent = `${avgRating} (${reviews.length} reviews)`;

    // Stock
    if (product.stock > 0) {
      els.stock.innerHTML = `<span class="in-stock">📦 ${product.stock} in stock</span>`;
      els.actions.style.display = 'flex';
    } else {
      els.stock.innerHTML = `<span class="out-stock">📦 Out of stock</span>`;
      els.actions.style.display = 'none';
    }
  }

  function renderReviews() {
    if (Auth.isAuthenticated) {
      els.reviewFormContainer.style.display = 'block';
      renderStarSelector();
    }

    if (reviews.length === 0) {
      els.reviewsList.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--color-text-muted);">No reviews yet. Be the first to review!</div>`;
      return;
    }

    els.reviewsList.innerHTML = reviews.map(rev => `
      <div style="background: var(--color-bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid #F0F0F0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600;">
              ${rev.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p style="font-weight: 600; font-size: 0.9rem;">${rev.userId?.name || 'Anonymous'}</p>
              <div style="font-size: 0.75rem;">
                ${[1,2,3,4,5].map(s => `<span style="color: ${s <= rev.rating ? 'var(--color-accent)' : '#CBD5E0'}">★</span>`).join('')}
              </div>
            </div>
          </div>
          <span style="font-size: 0.75rem; color: var(--color-text-light);">${new Date(rev.createdAt).toLocaleDateString()}</span>
        </div>
        <p style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.6;">${rev.comment}</p>
      </div>
    `).join('');
  }

  function renderStarSelector(hoverRating = 0) {
    els.starSelector.innerHTML = [1,2,3,4,5].map(s => `
      <button type="button" data-star="${s}" style="background: none; border: none; cursor: pointer; font-size: 24px; padding: 2px; color: ${s <= (hoverRating || rating) ? 'var(--color-accent)' : '#CBD5E0'}; transition: color 150ms;">
        ★
      </button>
    `).join('') + `<span style="margin-left: 0.5rem; color: var(--color-text-muted); font-size: 0.85rem; align-self: center;">${rating > 0 ? rating + '/5' : 'Select rating'}</span>`;
  }

  // Event Listeners
  els.qtyMinus.addEventListener('click', () => {
    if (quantity > 1) { quantity--; els.qtyValue.textContent = quantity; }
  });

  els.qtyPlus.addEventListener('click', () => {
    if (quantity < product.stock) { quantity++; els.qtyValue.textContent = quantity; }
  });

  els.addToCartBtn.addEventListener('click', async () => {
    if (!Auth.isAuthenticated) { showToast('Please sign in first', 'info'); return; }
    await Cart.add(productId, quantity);
  });

  els.wishlistBtn.addEventListener('click', async () => {
    if (!Auth.isAuthenticated) { showToast('Please sign in first', 'info'); return; }
    try {
      const data = await fetchApi(`/wishlist/${productId}`, { method: 'POST' });
      showToast(data.message, 'success');
    } catch (e) {
      showToast('Failed to update wishlist', 'error');
    }
  });

  // Review interactions
  els.starSelector.addEventListener('mouseover', (e) => {
    if (e.target.dataset.star) renderStarSelector(parseInt(e.target.dataset.star));
  });
  
  els.starSelector.addEventListener('mouseleave', () => renderStarSelector());

  els.starSelector.addEventListener('click', (e) => {
    if (e.target.dataset.star) {
      rating = parseInt(e.target.dataset.star);
      renderStarSelector();
    }
  });

  els.reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (rating === 0) { showToast('Please select a rating', 'error'); return; }
    const comment = els.reviewComment.value.trim();
    if (!comment) { showToast('Please write a comment', 'error'); return; }

    try {
      els.submitReview.disabled = true;
      els.submitReview.textContent = 'Submitting...';
      const data = await fetchApi(`/reviews/${productId}`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });
      showToast('Review submitted!', 'success');
      rating = 0;
      els.reviewComment.value = '';
      reviews = data.reviews;
      renderReviews();
    } catch (e) {
      showToast(e.message || 'Failed to submit review', 'error');
    } finally {
      els.submitReview.disabled = false;
      els.submitReview.textContent = 'Submit Review';
    }
  });

  fetchProduct();
});
