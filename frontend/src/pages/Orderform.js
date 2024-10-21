import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Orderform.css'; // Ensure the path is correct

const InputField = ({ label, name, value, onChange, readOnly = false, error }) => (
  <label>
    {label}:
    <input
      type={name === 'companyPhone' ? 'tel' : 'text'}
      name={name}
      value={value}
      onChange={onChange}
      className={readOnly ? "read-only" : ""}
      readOnly={readOnly}
      pattern={name === 'companyPhone' ? '[0-9]{10}' : undefined}
    />
    {error && <span className="error">{error}</span>}
  </label>
);

const OrderForm = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [formData, setFormData] = useState({
    userName: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    springSize: '',
    quantity: 1,
    pricePerUnit: product ? product.price : 0,
    productName: product ? product.name : '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName) newErrors.userName = 'User name is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.companyAddress) newErrors.companyAddress = 'Company address is required';
    if (product.category === 'Springs') {
      if (!formData.springSize) newErrors.springSize = 'Spring size is required';
      if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.companyPhone || !/^\d{10}$/.test(formData.companyPhone)) {
      newErrors.companyPhone = 'Valid phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        userName: formData.userName,
        companyName: formData.companyName,
        companyAddress: formData.companyAddress,
        companyPhone: formData.companyPhone,
        productName: formData.productName,
        pricePerUnit: formData.pricePerUnit,
        ...(product.category === 'Springs' && {
          springSize: formData.springSize,
          quantity: formData.quantity,
        }),
      };
  
      const apiurl = `http://localhost:8000/api/submit_${product.category.toLowerCase()}_order/`;
  
      try {
        const response = await fetch(apiurl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': window.csrfToken,
          },
          body: JSON.stringify(submissionData),
        });
  
        if (response.ok) {
          setMessage({ text: `Your order for ${product.name} has been placed successfully. Thank you!`, type: 'success' });
          resetForm();
        } else {
          const errorText = response.status === 400
            ? 'There seems to be an issue with the data you entered. Please check your details and try again.'
            : 'Failed to place order. Please try again.';
          setMessage({ text: errorText, type: 'error' });
        }
      } catch (error) {
        console.error('Error placing order:', error);
        setMessage({ text: 'Failed to place order. Please check your internet connection and try again.', type: 'error' });
      }
    }
  };
  
  const resetForm = () => {
    setFormData({
      userName: '',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      springSize: '',
      quantity: 1,
      pricePerUnit: product ? product.price : 0,
      productName: product ? product.name : '',
    });
    setErrors({});
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const totalCost = product.category === 'Springs' ? formData.pricePerUnit * formData.quantity : 0;

  if (!product) {
    return <div>No product details found.</div>;
  }

  return (
    <div className="order-form-page">
      <div className="product-details">
        <img src={product.image} alt={product.name} className="product-image" />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
      </div>
      <div className="order-form-container">
        <h1>Order Form</h1>
        <form onSubmit={handleSubmit}>
          <InputField label="User Name" name="userName" value={formData.userName} onChange={handleChange} error={errors.userName} />
          <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
          <InputField label="Product Name" name="productName" value={formData.productName} onChange={handleChange} readOnly error={errors.productName} />
          <InputField label="Company Address" name="companyAddress" value={formData.companyAddress} onChange={handleChange} error={errors.companyAddress} />
          <InputField label="Company Phone Number" name="companyPhone" value={formData.companyPhone} onChange={handleChange} error={errors.companyPhone} />
          <InputField label="Price Per Unit (₹)" name="pricePerUnit" value={formData.pricePerUnit} readOnly />
          {product.category === 'Springs' && (
            <>
              <InputField label="Spring Size (mm)" name="springSize" value={formData.springSize} onChange={handleChange} error={errors.springSize} />
              <InputField label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} error={errors.quantity} type="number" />
              <div className="total-cost">Total Cost: ₹{totalCost.toFixed(2)}</div>
            </>
          )}
          <button type="submit" className="submit-btn">Place Order</button>
        </form>
      </div>
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default OrderForm;
