document.addEventListener('DOMContentLoaded', async () => {
  if (!Auth.isAuthenticated) {
    window.location.href = 'login.html';
    return;
  }

  const container = document.getElementById('orders-container');

  try {
    const orders = await fetchApi('/orders');

    if (orders.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders.</p>
          <a href="marketplace.html" class="btn btn-primary mt-4">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="orders-list">
        ${orders.map(order => `
          <div class="order-card card">
            <div class="order-header">
              <div class="order-meta">
                <div>
                  <span class="order-label">Order Placed</span>
                  <span class="order-value">${new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="order-label">Total</span>
                  <span class="order-value">₹${order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span class="order-label">Order #</span>
                  <span class="order-value">${order._id}</span>
                </div>
              </div>
              <span class="badge badge-${order.status}">${order.status}</span>
            </div>

            <div class="order-body">
              <div class="order-items-list">
                ${order.items.map(item => `
                  <div class="order-item">
                    <img src="${item.image || 'https://placehold.co/80'}" alt="${item.name}">
                    <div class="order-item-info">
                      <a href="product.html?id=${item.productId}" class="order-item-name">${item.name}</a>
                      <p class="order-item-qty">Qty: ${item.quantity}</p>
                      <p class="order-item-price">₹${item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <a href="product.html?id=${item.productId}" class="btn btn-secondary btn-sm" style="align-self: center;">
                      View
                    </a>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<div style="text-align: center; color: var(--color-error); padding: 2rem;">${e.message || 'Failed to fetch orders'}</div>`;
  }
});
