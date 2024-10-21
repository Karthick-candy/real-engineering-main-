import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/Adminregister.css';
import adminRegistrationImage from '../images/adminregistrationimage.avif';

const AdminRegister = () => {
  const initialFormData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  };

  const initialErrors = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    form: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.username) {
      formErrors.username = 'Username is required';
      isValid = false;
    }
    if (!formData.email) {
      formErrors.email = 'Email is required';
      isValid = false;
    }
    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters long';
      isValid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    if (!formData.first_name) {
      formErrors.first_name = 'First name is required';
      isValid = false;
    }
    if (!formData.last_name) {
      formErrors.last_name = 'Last name is required';
      isValid = false;
    }
    if (!formData.phone_number) {
      formErrors.phone_number = 'Phone number is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/api/admin_registration/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          setMessage({ text: result.message, type: 'success' });
          setFormData(initialFormData);

          setTimeout(() => {
            setMessage({ text: '', type: '' });
          }, 3000);
        } else {
          setMessage({ text: result.message || 'Registration failed', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Network error: ' + error.message, type: 'error' });
      }
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);
    }
  };

  return (
    <div className="admin-register-container">
      <div className="admin-register-content">
        <h2>Admin Registration</h2>
        <p>Create a new admin account to access the admin panel.</p>
      </div>
      <div className="admin-register-section">
        <div className="admin-register-image">
          <img src={adminRegistrationImage} alt="Admin Registration" />
        </div>
        <div className="admin-register-form">
          <form onSubmit={handleSubmit}>
            <label>
              Admin Username:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <span className="error">{errors.username}</span>}
            </label>
            <label>
              Admin Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>
            <label className="password-wrapper">
              Password:
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </label>
            <label className="password-wrapper">
              Confirm Password:
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </label>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              {errors.first_name && <span className="error">{errors.first_name}</span>}
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              {errors.last_name && <span className="error">{errors.last_name}</span>}
            </label>
            <label>
              Phone Number:
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
              {errors.phone_number && <span className="error">{errors.phone_number}</span>}
            </label>
            <button type="submit" className="register-btn">Register</button>
          </form>
          <p className="login-link">Already have an account? <Link to="/admin-login">Login</Link></p>
        </div>
        {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
      </div>
    </div>
  );
};

export default AdminRegister;
