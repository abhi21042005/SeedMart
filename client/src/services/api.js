import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userInfo');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const getAllUsers = () => API.get('/auth/users');

// ============ PRODUCTS ============
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
export const getSellerProducts = () => API.get('/products/seller/my');

export const createProduct = (formData) =>
  API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) => API.delete(`/products/${id}`);

// ============ CART ============
export const getCart = () => API.get('/cart');
export const addToCart = (productId, quantity = 1) =>
  API.post('/cart', { productId, quantity });
export const updateCartItem = (productId, quantity) =>
  API.put(`/cart/${productId}`, { quantity });
export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);
export const clearCart = () => API.delete('/cart/clear');

// ============ ORDERS ============
export const createOrder = () => API.post('/orders');
export const getUserOrders = () => API.get('/orders/my');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const getSellerOrders = () => API.get('/orders/seller');
export const getAllOrders = () => API.get('/orders/all');
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}/status`, { status });

// ============ REVIEWS ============
export const getProductReviews = (productId) => API.get(`/reviews/${productId}`);
export const addReview = (productId, data) => API.post(`/reviews/${productId}`, data);
export const deleteReview = (productId, reviewId) =>
  API.delete(`/reviews/${productId}/${reviewId}`);

// ============ WISHLIST ============
export const getWishlist = () => API.get('/wishlist');
export const toggleWishlist = (productId) => API.post(`/wishlist/${productId}`);

// ============ CHATBOT ============
export const sendChatMessage = (message) => API.post('/chatbot', { message });

export default API;
