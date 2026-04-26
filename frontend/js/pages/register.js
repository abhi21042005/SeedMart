document.addEventListener('DOMContentLoaded', () => {
  if (Auth.isAuthenticated) {
    window.location.href = 'index.html';
    return;
  }

  const form = document.getElementById('register-form');
  const submitBtn = document.getElementById('register-submit');
  const roleOptions = document.querySelectorAll('.role-option');
  
  let selectedRole = 'farmer';

  // Role selector logic
  roleOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      roleOptions.forEach(b => b.classList.remove('role-active'));
      btn.classList.add('role-active');
      selectedRole = btn.dataset.role;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-pass').value.trim();
    const confirmPassword = document.getElementById('reg-confirm').value.trim();

    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';
      
      const user = await Auth.register(name, email, password, selectedRole);
      showToast(`Welcome to SeedMart, ${user.name}!`, 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
});
