document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.isAuthenticated || (!Auth.isSeller && !Auth.isAdmin)) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('dashboard-title').textContent = Auth.isAdmin ? 'Admin Dashboard' : 'Seller Dashboard';
  document.getElementById('dashboard-subtitle').textContent = `Welcome back, ${Auth.user.name}`;
  document.getElementById('orders-title').textContent = Auth.isAdmin ? 'All Orders' : 'Customer Orders';

  const els = {
    tabProducts: document.getElementById('tab-products'),
    tabOrders: document.getElementById('tab-orders'),
    secProducts: document.getElementById('section-products'),
    secOrders: document.getElementById('section-orders'),
    tbodyProducts: document.getElementById('products-tbody'),
    tbodyOrders: document.getElementById('orders-tbody'),
    
    // Form
    btnAdd: document.getElementById('btn-add-product'),
    btnCancel: document.getElementById('btn-cancel-form'),
    form: document.getElementById('product-form'),
    formTitle: document.getElementById('form-title'),
    btnSubmit: document.getElementById('btn-submit-form'),
    
    // Form Inputs
    iName: document.getElementById('p-name'),
    iCategory: document.getElementById('p-category'),
    iPrice: document.getElementById('p-price'),
    iStock: document.getElementById('p-stock'),
    iDesc: document.getElementById('p-desc'),
    iImage: document.getElementById('p-image')
  };

  let products = [];
  let orders = [];
  let editingId = null;

  async function fetchData() {
    try {
      const [prodRes, ordRes] = await Promise.all([
        fetchApi('/products/seller/me'),
        fetchApi(Auth.isAdmin ? '/orders/admin/all' : '/orders/seller')
      ]);
      products = prodRes;
      orders = ordRes;
      
      els.tabProducts.textContent = `📦 Products (${products.length})`;
      els.tabOrders.textContent = `🛍️ Orders (${orders.length})`;

      renderProducts();
      renderOrders();
    } catch (e) {
      showToast('Failed to load dashboard data', 'error');
    }
  }

  function renderProducts() {
    if (products.length === 0) {
      els.tbodyProducts.innerHTML = `<tr><td colspan="5" class="text-center">No products found. Add one above!</td></tr>`;
      return;
    }

    els.tbodyProducts.innerHTML = products.map(p => `
      <tr>
        <td>
          <div class="table-product">
            <img src="${p.image || 'https://placehold.co/50'}" alt="${p.name}" onerror="this.src='https://placehold.co/50'">
            <span>${p.name}</span>
          </div>
        </td>
        <td style="text-transform: capitalize">${p.category}</td>
        <td>₹${p.price}</td>
        <td>${p.stock}</td>
        <td>
          <div class="table-actions">
            <button class="action-btn edit" onclick="window.editProduct('${p._id}')">✏️</button>
            <button class="action-btn delete" onclick="window.deleteProduct('${p._id}')">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function renderOrders() {
    if (orders.length === 0) {
      els.tbodyOrders.innerHTML = `<tr><td colspan="6" class="text-center">No orders found.</td></tr>`;
      return;
    }

    els.tbodyOrders.innerHTML = orders.map(o => `
      <tr>
        <td>${o._id.substring(o._id.length - 6)}</td>
        <td>${o.userId?.name || 'Unknown'}</td>
        <td>${new Date(o.createdAt).toLocaleDateString()}</td>
        <td>₹${o.totalPrice}</td>
        <td><span class="badge badge-${o.status}">${o.status}</span></td>
        <td>
          <select class="status-select" onchange="window.updateOrderStatus('${o._id}', this.value)">
            <option value="pending" ${o.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  // Window functions for inline HTML handlers
  window.editProduct = (id) => {
    const p = products.find(x => x._id === id);
    if (!p) return;
    editingId = id;
    els.formTitle.textContent = 'Edit Product';
    els.iName.value = p.name;
    els.iCategory.value = p.category;
    els.iPrice.value = p.price;
    els.iStock.value = p.stock;
    els.iDesc.value = p.description;
    els.iImage.value = ''; // clear file input
    els.form.style.display = 'block';
  };

  window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetchApi(`/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted', 'success');
      fetchData();
    } catch (e) {
      showToast('Delete failed', 'error');
    }
  };

  window.updateOrderStatus = async (id, status) => {
    try {
      await fetchApi(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      showToast('Order status updated', 'success');
      fetchData();
    } catch (e) {
      showToast('Status update failed', 'error');
    }
  };

  // Event Listeners
  els.tabProducts.addEventListener('click', () => {
    els.tabProducts.classList.add('active');
    els.tabOrders.classList.remove('active');
    els.secProducts.style.display = 'block';
    els.secOrders.style.display = 'none';
  });

  els.tabOrders.addEventListener('click', () => {
    els.tabOrders.classList.add('active');
    els.tabProducts.classList.remove('active');
    els.secOrders.style.display = 'block';
    els.secProducts.style.display = 'none';
  });

  els.btnAdd.addEventListener('click', () => {
    editingId = null;
    els.formTitle.textContent = 'New Product';
    els.form.reset();
    els.form.style.display = 'block';
  });

  els.btnCancel.addEventListener('click', () => {
    els.form.style.display = 'none';
  });

  els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', els.iName.value);
    formData.append('category', els.iCategory.value);
    formData.append('price', els.iPrice.value);
    formData.append('stock', els.iStock.value);
    formData.append('description', els.iDesc.value);
    
    if (els.iImage.files[0]) {
      formData.append('image', els.iImage.files[0]);
    }

    try {
      els.btnSubmit.disabled = true;
      els.btnSubmit.textContent = 'Saving...';
      
      if (editingId) {
        await fetchApi(`/products/${editingId}`, { method: 'PUT', body: formData });
        showToast('Product updated', 'success');
      } else {
        await fetchApi('/products', { method: 'POST', body: formData });
        showToast('Product created', 'success');
      }
      
      els.form.style.display = 'none';
      fetchData();
    } catch (e) {
      showToast(e.message || 'Action failed', 'error');
    } finally {
      els.btnSubmit.disabled = false;
      els.btnSubmit.textContent = 'Save Product';
    }
  });

  // Init
  fetchData();
});
