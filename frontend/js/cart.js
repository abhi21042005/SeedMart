const Cart = {
  data: { items: [], totalPrice: 0 },
  listeners: [],

  async fetch() {
    if (!Auth.isAuthenticated) return;
    try {
      const data = await fetchApi('/cart');
      this.data = data;
      this.notify();
    } catch (e) {
      console.error('Failed to fetch cart', e);
    }
  },

  async add(productId, quantity = 1) {
    if (!Auth.isAuthenticated) {
      showToast('Please sign in first', 'info');
      return;
    }
    try {
      const data = await fetchApi('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
      });
      this.data = data;
      this.notify();
      showToast('Added to cart!', 'success');
    } catch (e) {
      showToast(e.message || 'Failed to add to cart', 'error');
    }
  },

  async update(productId, quantity) {
    try {
      const data = await fetchApi('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity })
      });
      this.data = data;
      this.notify();
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  async remove(productId) {
    try {
      const data = await fetchApi(`/cart/remove/${productId}`, { method: 'DELETE' });
      this.data = data;
      this.notify();
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  async clear() {
    try {
      await fetchApi('/cart/clear', { method: 'DELETE' });
      this.data = { items: [], totalPrice: 0 };
      this.notify();
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.data);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  },

  notify() {
    this.listeners.forEach(cb => cb(this.data));
  }
};

// Auto fetch if logged in
if (Auth.isAuthenticated) {
  Cart.fetch();
}
