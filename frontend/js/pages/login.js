document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isAuthenticated) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('login-form');
  const submitBtn = document.getElementById('login-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';
      
      const user = await Auth.login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
});
