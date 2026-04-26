document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.isAuthenticated) {
    window.location.href = 'login.html';
    return;
  }

  const container = document.getElementById('cart-container');
  let checkoutLoading = false;

  function renderEmpty() {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛍️</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="marketplace.html" class="btn btn-primary btn-lg mt-4">Start Shopping</a>
      </div>
    `;
  }

  function renderCart(cartData) {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      renderEmpty();
      return;
    }

    const itemsHtml = cartData.items.map(item => {
      const product = item.productId;
      if (!product) return '';
      
      return `
        <div class="cart-item">
          <a href="product.html?id=${product._id}" class="cart-item-img">
            <img src="${product.image || 'https://placehold.co/200'}" alt="${product.name}" onerror="this.src='https://placehold.co/200'">
          </a>
          <div class="cart-item-info">
            <a href="product.html?id=${product._id}" class="cart-item-name">${product.name}</a>
            <p class="cart-item-price">₹${product.price?.toLocaleString('en-IN')}</p>
            ${product.stock > 0 && product.stock < 5 ? `<p class="stock-warning">Only ${product.stock} left!</p>` : ''}
            ${product.stock <= 0 ? `<p class="stock-error">Out of stock</p>` : ''}
          </div>
          <div class="cart-item-actions">
            <div class="qty-selector">
              <button onclick="window.updateCartQty('${product._id}', ${item.quantity - 1}, ${product.stock})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
              <span>${item.quantity}</span>
              <button onclick="window.updateCartQty('${product._id}', ${item.quantity + 1}, ${product.stock})" ${item.quantity >= product.stock ? 'disabled' : ''}>+</button>
            </div>
            <button class="cart-item-remove" onclick="Cart.remove('${product._id}')" title="Remove item">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    const hasOutofStock = cartData.items.some(i => i.productId?.stock < i.quantity);

    container.innerHTML = `
      <h1 class="cart-title">Shopping Cart</h1>
      <div class="cart-layout">
        <div class="cart-items">
          ${itemsHtml}
          <div class="cart-actions">
            <button class="btn btn-secondary btn-sm" onclick="Cart.clear()">Clear Cart</button>
            <a href="marketplace.html" class="btn btn-secondary btn-sm">Continue Shopping</a>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal (${cartData.items.reduce((a,c) => a + c.quantity, 0)} items)</span>
            <span>₹${cartData.totalPrice?.toLocaleString('en-IN') || 0}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span class="text-success">Free</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row summary-total">
            <span>Total</span>
            <span>₹${cartData.totalPrice?.toLocaleString('en-IN') || 0}</span>
          </div>
          <button 
            class="btn btn-primary btn-lg checkout-btn" 
            onclick="window.handleCheckout()" 
            ${checkoutLoading || hasOutofStock ? 'disabled' : ''}
          >
            ${checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          ${hasOutofStock ? `<p class="summary-error mt-2">Some items are out of stock. Please remove or reduce quantity to checkout.</p>` : ''}
        </div>
      </div>
    `;
  }

  // Global functions for inline handlers
  window.updateCartQty = async (productId, newQty, stock) => {
    if (newQty < 1) return;
    if (newQty > stock) {
      showToast(`Only ${stock} items available`, 'warning');
      return;
    }
    await Cart.update(productId, newQty);
  };

  window.handleCheckout = async () => {
    try {
      checkoutLoading = true;
      renderCart(Cart.data); // re-render to disable button
      
      await fetchApi('/orders', { method: 'POST' });
      showToast('Order placed successfully!', 'success');
      await Cart.fetch(); // fetch latest (empty)
      
      setTimeout(() => {
        window.location.href = 'orders.html';
      }, 1000);
    } catch (e) {
      showToast(e.message || 'Checkout failed', 'error');
    } finally {
      checkoutLoading = false;
      renderCart(Cart.data);
    }
  };

  // Subscribe to Cart updates
  Cart.subscribe((data) => {
    renderCart(data);
  });
});
