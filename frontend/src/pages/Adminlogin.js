// src/pages/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';
import '../styles/Adminlogin.css';
import adminLoginImage from '../images/adminloginimage.avif';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ admin_email: '', password: '' });
  const [errors, setErrors] = useState({ admin_email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.admin_email) {
      formErrors.admin_email = 'Admin Email is required';
      isValid = false;
    }
    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await login(formData.admin_email, formData.password);
        navigate('/admin-dashboard');
      } catch (error) {
        setLoginError(error.message || 'Network error');
      }
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-content">
        <h2>Admin Login</h2>
        <p>Welcome back! Please login to access the admin panel.</p>
      </div>
      <div className="admin-login-section">
        <div className="admin-login-image">
          <img src={adminLoginImage} alt="Admin Login" />
        </div>
        <div className="admin-login-form">
          <form onSubmit={handleSubmit}>
            <label>
              Admin Email:
              <input
                type="email"
                name="admin_email"
                value={formData.admin_email}
                onChange={handleChange}
              />
              {errors.admin_email && <span className="error">{errors.admin_email}</span>}
            </label>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error">{errors.password}</span>}
            </label>
            {loginError && <p className="error-message">{loginError}</p>}
            <button type="submit" className="login-btn">Login</button>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
