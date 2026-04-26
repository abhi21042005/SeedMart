const Auth = {
  user: null,

  init() {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        this.logout();
      }
    }
  },

  get isAuthenticated() {
    return !!this.user;
  },

  get isAdmin() {
    return this.user?.role === 'admin';
  },

  get isSeller() {
    return this.user?.role === 'seller';
  },

  get isFarmer() {
    return this.user?.role === 'farmer';
  },

  async login(email, password) {
    const data = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    this.user = data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  },

  async register(name, email, password, role) {
    const data = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    
    this.user = data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    
    return data;
  },

  logout() {
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }
};

Auth.init();
