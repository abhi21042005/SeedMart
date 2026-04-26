document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  
  let state = {
    page: 1,
    search: urlParams.get('search') || '',
    category: urlParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    totalPages: 1,
    wishlistIds: []
  };

  const els = {
    container: document.getElementById('products-container'),
    count: document.getElementById('product-count'),
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    category: document.getElementById('filter-category'),
    sort: document.getElementById('filter-sort'),
    minPrice: document.getElementById('min-price'),
    maxPrice: document.getElementById('max-price'),
    clearBtn: document.getElementById('clear-filters'),
    pagination: document.getElementById('pagination-container'),
    pageNumbers: document.getElementById('page-numbers'),
    prevBtn: document.getElementById('prev-page'),
    nextBtn: document.getElementById('next-page'),
  };

  // Init form values
  els.searchInput.value = state.search;
  els.category.value = state.category;

  async function init() {
    if (Auth.isAuthenticated) {
      try {
        const { products } = await fetchApi('/wishlist');
        state.wishlistIds = products.map(p => p._id || p);
      } catch (e) {}
    }
    fetchProducts();
  }

  async function fetchProducts() {
    els.container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">Loading products...</div>';
    
    // Update clear button visibility
    els.clearBtn.style.display = (state.search || state.category || state.minPrice || state.maxPrice || state.sort) ? 'inline-block' : 'none';

    try {
      let query = `?page=${state.page}&limit=12`;
      if (state.search) query += `&search=${encodeURIComponent(state.search)}`;
      if (state.category) query += `&category=${state.category}`;
      if (state.minPrice) query += `&minPrice=${state.minPrice}`;
      if (state.maxPrice) query += `&maxPrice=${state.maxPrice}`;
      if (state.sort) query += `&sort=${state.sort}`;

      const { products, total, pages } = await fetchApi(`/products${query}`);
      state.totalPages = pages;
      
      els.count.textContent = `${total} products available`;

      if (products.length === 0) {
        els.container.innerHTML = `
          <div style="text-align: center; padding: 4rem 0; color: var(--color-text-muted); grid-column: 1/-1;">
            <p style="font-size: 3rem; margin-bottom: 1rem;">🌾</p>
            <p style="font-size: 1.1rem;">No products found matching your criteria.</p>
          </div>`;
        els.pagination.style.display = 'none';
        return;
      }

      renderProducts(products);
      renderPagination();
    } catch (e) {
      els.container.innerHTML = `<div style="grid-column: 1/-1; color: var(--color-error); text-align: center;">Error loading products.</div>`;
    }
  }

  function renderProducts(products) {
    els.container.innerHTML = products.map(product => {
      const isWishlisted = state.wishlistIds.includes(product._id);
      
      return `
        <a href="product.html?id=${product._id}" class="product-card card">
          <div class="product-card-image">
            <img src="${product.image || 'https://placehold.co/400x300'}" alt="${product.name}" loading="lazy" />
            <span class="badge badge-${product.category}">${product.category}</span>
            <button class="wishlist-btn ${isWishlisted ? 'wishlisted' : ''}" onclick="window.toggleWishlist(event, '${product._id}')" title="Toggle wishlist">
              ♥
            </button>
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
      `;
    }).join('');
  }

  function renderPagination() {
    if (state.totalPages <= 1) {
      els.pagination.style.display = 'none';
      return;
    }
    
    els.pagination.style.display = 'flex';
    els.prevBtn.disabled = state.page <= 1;
    els.nextBtn.disabled = state.page >= state.totalPages;

    let html = '';
    const start = Math.max(1, state.page - 2);
    const end = Math.min(state.totalPages, state.page + 2);
    
    for (let i = start; i <= end; i++) {
      html += `<button class="page-num ${i === state.page ? 'page-active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    els.pageNumbers.innerHTML = html;
  }

  // Global toggle wishlist function for inline onclick
  window.toggleWishlist = async (e, productId) => {
    e.preventDefault();
    if (!Auth.isAuthenticated) {
      showToast('Please sign in to use wishlist', 'info');
      return;
    }
    try {
      await fetchApi(`/wishlist/${productId}`, { method: 'POST' });
      const isWishlisted = state.wishlistIds.includes(productId);
      if (isWishlisted) {
        state.wishlistIds = state.wishlistIds.filter(id => id !== productId);
        e.target.classList.remove('wishlisted');
      } else {
        state.wishlistIds.push(productId);
        e.target.classList.add('wishlisted');
      }
    } catch (e) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  // Event Listeners
  els.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.search = els.searchInput.value.trim();
    state.page = 1;
    fetchProducts();
  });

  els.category.addEventListener('change', (e) => {
    state.category = e.target.value;
    state.page = 1;
    fetchProducts();
  });

  els.sort.addEventListener('change', (e) => {
    state.sort = e.target.value;
    state.page = 1;
    fetchProducts();
  });

  [els.minPrice, els.maxPrice].forEach(input => {
    input.addEventListener('change', () => {
      state.minPrice = els.minPrice.value;
      state.maxPrice = els.maxPrice.value;
      state.page = 1;
      fetchProducts();
    });
  });

  els.clearBtn.addEventListener('click', () => {
    state = { ...state, search: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 };
    els.searchInput.value = '';
    els.category.value = '';
    els.sort.value = '';
    els.minPrice.value = '';
    els.maxPrice.value = '';
    window.history.replaceState({}, '', 'marketplace.html'); // clear URL params
    fetchProducts();
  });

  els.prevBtn.addEventListener('click', () => {
    if (state.page > 1) { state.page--; fetchProducts(); }
  });

  els.nextBtn.addEventListener('click', () => {
    if (state.page < state.totalPages) { state.page++; fetchProducts(); }
  });

  els.pageNumbers.addEventListener('click', (e) => {
    if (e.target.classList.contains('page-num')) {
      state.page = parseInt(e.target.dataset.page);
      fetchProducts();
    }
  });

  init();
});
