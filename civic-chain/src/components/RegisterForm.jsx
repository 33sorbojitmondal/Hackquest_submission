import React, { useState } from 'react';
import { UserIcon, MailIcon, LockClosedIcon, MapPinIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', location: ''
  });

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-auto bg-white rounded shadow p-4"
    >
      <h1 className="h3 fw-bold mb-4 text-center">Create Your Account</h1>
      
      <form className="mb-3">
        <div className="mb-3">
          <label className="form-label fw-medium">Full Name</label>
          <div className="input-group">
            <span className="input-group-text">
              <UserIcon className="bi" style={{ width: '1.25rem', height: '1.25rem' }} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-medium">Email Address</label>
          <div className="input-group">
            <span className="input-group-text">
              <MailIcon className="bi" style={{ width: '1.25rem', height: '1.25rem' }} />
            </span>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-medium">Password</label>
          <div className="input-group">
            <span className="input-group-text">
              <LockClosedIcon className="bi" style={{ width: '1.25rem', height: '1.25rem' }} />
            </span>
            <input
              type="password"
              className="form-control"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-medium">Location (Optional)</label>
          <div className="input-group">
            <span className="input-group-text">
              <MapPinIcon className="bi" style={{ width: '1.25rem', height: '1.25rem' }} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-100 btn btn-primary py-2 px-3 rounded"
        >
          Create Account
        </button>
      </form>
      
      <div className="text-center">
        <p className="text-muted small">
          Already have an account?{' '}
          <a href="/login" className="text-primary fw-medium">
            Login here
          </a>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm; 