import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      await register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create an Account</h2>
                <p className="text-muted">Join CivicChain and make a difference in your community</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="bio" className="form-label">Bio (Optional)</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    placeholder="Tell us a bit about yourself"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-decoration-none fw-medium">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
