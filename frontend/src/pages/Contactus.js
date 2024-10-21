import React, { useState, useEffect, useCallback } from 'react';
import GoogleSignIn from '../components/GoogleSignIn';
import '../styles/Contactus.css';
import { googleLogout } from '@react-oauth/google';

const API_URL = 'http://localhost:8000/api';

const Contactus = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleSignOut = useCallback(() => {
    googleLogout();
    setIsAuthenticated(false);
    setUserInfo(null);
    sessionStorage.clear();
    localStorage.clear();
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  }, []);

  useEffect(() => {
    const storedUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    const signedInFlag = localStorage.getItem('signedIn');

    if (storedUserInfo) {
      setIsAuthenticated(true);
      setUserInfo(storedUserInfo);
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: storedUserInfo.name,
        email: storedUserInfo.email
      }));
    } else if (signedInFlag) {
      handleSignOut();
    }
  }, [handleSignOut]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Please provide your name so we can address you properly.';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address, like user@example.com.';
    if (!formData.subject) newErrors.subject = 'Don’t forget to include a subject for your message.';
    if (!formData.message) newErrors.message = 'Please write your message before submitting.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isAuthenticated) {
        try {
          const response = await fetch(`${API_URL}/send_mail_through_contact/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          
          if (response.ok) {
            setMessage({ text: 'Thank you for reaching out to us. We will get back to you shortly.', type: 'success' });
            setFormData((prevFormData) => ({
              ...prevFormData,
              subject: '',
              message: ''
            }));
            setTimeout(() => {
              setMessage({ text: '', type: '' });
            }, 5000);
          } else {
            setMessage({ text: 'Oops! Something went wrong while sending your message. Please try again.', type: 'error' });
          }
        } catch (error) {
          setMessage({ text: 'Unable to send your message at the moment. Please check your internet connection and try again.', type: 'error' });
        }
      } else {
        alert('You need to sign in to submit the form.');
      }
    }
  };

  const handleLoginSuccess = (response) => {
    setIsAuthenticated(true);
    const userData = {
      name: response.name,
      email: response.email,
      profilePic: response.profilePic
    };
    setUserInfo(userData);
    sessionStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('signedIn', 'true');
    setFormData((prevFormData) => ({
      ...prevFormData,
      name: response.name,
      email: response.email
    }));
  };

  return (
    <div className="contactus-page">
      {isAuthenticated && userInfo && (
        <div className="profile-box">
          <img
            src={userInfo.profilePic}
            alt="Profile"
            className="profile-pic"
          />
          <div className="profile-info">
            <span className="profile-name">{userInfo.name}</span>
            <button onClick={handleSignOut} className="sign-out-btn">Sign Out</button>
          </div>
        </div>
      )}

      <section className="contact-us-section">
        <h1>Contact Us</h1>
        <p>We are here to assist you! Whether you have questions about our products, need technical support, or just want to share your feedback, we're here to help. Please use the form below or contact us through the details provided.</p>
      </section>
      
      <section className="contact-form-section">
        <h2>Send Us a Message</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">
            Name:
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={isAuthenticated}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label htmlFor="email">
            Email:
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={isAuthenticated}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label htmlFor="subject">
            Subject:
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter the subject"
            />
            {errors.subject && <span className="error">{errors.subject}</span>}
          </label>
          <label htmlFor="message">
            Message:
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              rows="5"
            />
            {errors.message && <span className="error">{errors.message}</span>}
          </label>
          <button type="submit" className="submit-btn">Submit</button>

        </form>
        {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

        {!isAuthenticated && (
          <section className="google-login-section">
            <div className="google-login-content">
              <h2>Please Sign In with Google</h2>
              <GoogleSignIn onSuccess={handleLoginSuccess} />
            </div>
          </section>                
        )}
      </section>

      <section className="contact-info">
        <h2>Contact Details</h2>
        <p>You can also reach us using the following contact details:</p>
        <ul>
          <li><strong>Phone:</strong> +1 (123) 456-7890</li>
          <li><strong>Email:</strong> contact@company.com</li>
          <li><strong>Address:</strong> 123 Business Rd, City, Country, 12345</li>
          <li><strong>Office Hours:</strong> Mon-Fri, 9 AM - 5 PM (EST)</li>
        </ul>
      </section>

      <section className="social-media">
        <h2>Follow Us</h2>
        <p>Stay updated with our latest news and updates. Follow us on social media:</p>
        <ul>
          <li>
            <a href="https://facebook.com/yourcompany" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
            </a>
          </li>
          <li>
            <a href="https://instagram.com/yourcompany" target="_blank" rel="noopener noreferrer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" />
            </a>
          </li>
        </ul>
      </section>

      <section className="map">
        <h2>Our Location</h2>
        <p>Find us at our office location on the map below:</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d470.0121155985765!2d77.10951775286742!3d11.087962543290258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8ff7503156af7%3A0xe045f10c145dccf7!2sReal%20Engineering!5e1!3m2!1sen!2sin!4v1726212510005!5m2!1sen!2sin"
          width="600"
          height="450"
          allowFullScreen=""
          loading="lazy"
          title="Company Location"
        ></iframe>
      </section>

    </div>
  );
};

export default Contactus;
