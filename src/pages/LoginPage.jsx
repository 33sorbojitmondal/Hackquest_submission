import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Login page component
 * Allows users to log in to their account
 */
const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // For demo purposes, we'll just simulate a successful login
      // In a real app, you would call your API here
      setTimeout(() => {
        // Check if email and password are provided
        if (!formData.email || !formData.password) {
          throw new Error('Please provide both email and password');
        }
        
        // Call the onLogin function passed from App.jsx
        onLogin();
        
        // Navigate to dashboard
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <h1>Login to Your Account</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="form-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage; 