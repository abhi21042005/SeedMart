import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields'); return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match'); return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    try {
      setLoading(true);
      const user = await register(name, email, password, role);
      toast.success(`Welcome to SeedMart, ${user.name}!`);
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-container">
        <div className="auth-card animate-fade-in-up">
          <div className="auth-header">
            <div className="auth-logo">🌱</div>
            <h1>Join SeedMart</h1>
            <p>Create your free account</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form" id="register-form">
            <div className="form-group">
              <label htmlFor="reg-name"><FiUser size={14} /> Full Name</label>
              <input type="text" id="reg-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email"><FiMail size={14} /> Email</label>
              <input type="email" id="reg-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="farmer@example.com" required />
            </div>
            <div className="form-group">
              <label>I am a</label>
              <div className="role-selector" id="role-selector">
                {['farmer', 'seller'].map(r => (
                  <button key={r} type="button" className={`role-option ${role === r ? 'role-active' : ''}`} onClick={() => setRole(r)}>
                    {r === 'farmer' ? '🧑‍🌾' : '🏪'} {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="reg-pass"><FiLock size={14} /> Password</label>
              <input type="password" id="reg-pass" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6} />
            </div>
            <div className="form-group">
              <label htmlFor="reg-confirm"><FiLock size={14} /> Confirm Password</label>
              <input type="password" id="reg-confirm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="register-submit">
              <FiUserPlus size={18} /> {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
