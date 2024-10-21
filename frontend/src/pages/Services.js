import React, { useState } from 'react';
import '../styles/Services.css';
import Popuppage from '../components/Popup';

const ServiceRequest = () => {
  const initialFormData = {
    name: '',
    companyName: '',
    address: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    machineType: '',
    problemDescription: '',
  };

  const initialErrors = {
    name: '',
    companyName: '',
    address: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    machineType: '',
    problemDescription: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState('');

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

    if (!formData.name) {
      formErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.companyName) {
      formErrors.companyName = 'Company name is required';
      isValid = false;
    }
    if (!formData.address) {
      formErrors.address = 'Address is required';
      isValid = false;
    }
    if (!formData.phoneNumber) {
      formErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      formErrors.phoneNumber = 'Phone number must be 10 digits';
      isValid = false;
    }
    if (!formData.alternatePhoneNumber) {
      formErrors.alternatePhoneNumber = 'Alternate phone number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.alternatePhoneNumber)) {
      formErrors.alternatePhoneNumber = 'Alternate phone number must be 10 digits';
      isValid = false;
    }
    if (!formData.machineType) {
      formErrors.machineType = 'Machine type is required';
      isValid = false;
    }
    if (!formData.problemDescription) {
      formErrors.problemDescription = 'Problem description is required';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
  
      console.log('Form Data to Send:', Object.fromEntries(formDataToSend.entries())); // Log form data
  
      try {
        const response = await fetch('http://localhost:8000/api/generate_whatsapp_url/', {
          method: 'POST',
          headers: {
            'content-Type':'application/json',
            'X-CSRFToken': window.csrfToken,
          },
          body:JSON.stringify(formData),
        });
  
        if (response.ok) {
          const data = await response.json();
          window.open(data.whatsapp_url, '_blank');
          setPopupContent('Please confirm that you have sent the WhatsApp message.');
          setIsPopupOpen(true); // Open the popup with confirmation message
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch:', response.status, errorData);
          setPopupContent('Failed to generate WhatsApp URL. Please try again.');
          setIsPopupOpen(true);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPopupContent('Failed to generate WhatsApp URL. Please try again.');
        setIsPopupOpen(true);
      }
    }
  };
  

  const handleConfirmation = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/save_service_request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': window.csrfToken,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form and state after successful save
        setFormData(initialFormData);
        setPopupContent('Service request raised successfully. We will get back to you soon! Thank you!!');
        setIsPopupOpen(true);
      } else {
        const errorData = await response.json();
        console.error('Failed to save service request:', response.status, errorData);
        setPopupContent('Failed to save service request. Please try again.');
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error('Error saving service request:', error);
      setPopupContent('Failed to save service request. Please try again.');
      setIsPopupOpen(true);
    }
  };

  return (
    <div className="service-request-page">
      <div className="service-request-content">
        <h1>Service Request</h1>
        <p>
          At Real Engineering, we pride ourselves on offering comprehensive services for a variety of machinery used in the mattress manufacturing industry. Whether you need maintenance, repairs, or consultation, our experienced team is here to help. We provide expert services for the following types of machines:
        </p>
        <ul>
          <li><strong>Foaming Machines:</strong> Ensuring optimal performance and longevity for all your foam production needs.</li>
          <li><strong>Foam Cutting Machines:</strong> Precision maintenance and repair services to keep your cutting processes efficient.</li>
          <li><strong>Foam Related Machines:</strong> Detailed services for all auxiliary foam machinery to support your production line.</li>
          <li><strong>Quilting Machines:</strong> Comprehensive support for high-quality quilt production, ensuring seamless operation.</li>
          <li><strong>Stitching Machines:</strong> Expert repairs and maintenance to keep your stitching operations running smoothly.</li>
          <li><strong>Tape Edge Machines:</strong> Specialized services for tape edge machines to enhance the durability and finish of your products.</li>
          <li><strong>Spring Machines:</strong> (Pocketed, Bonnel) - Tailored services for spring machinery to ensure robust and reliable spring production.</li>
        </ul>
        <p>
          Our goal is to minimize downtime and maximize the efficiency of your operations. Please fill out the service request form below with your details, and our team will get back to you promptly.
        </p>
      </div>
      <div className="service-request-form-container">
        <form onSubmit={handleSubmit} className="service-request-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            {errors.companyName && <span className="error">{errors.companyName}</span>}
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </label>
          <label>
            Alternate Phone Number:
            <input
              type="text"
              name="alternatePhoneNumber"
              value={formData.alternatePhoneNumber}
              onChange={handleChange}
            />
            {errors.alternatePhoneNumber && <span className="error">{errors.alternatePhoneNumber}</span>}
          </label>
          <label>
            Machine Type:
            <select
              name="machineType"
              value={formData.machineType}
              onChange={handleChange}
            >
              <option value="">Select a machine</option>
              <option value="Foaming Machine">Foaming Machine</option>
              <option value="Foam Cutting Machine">Foam Cutting Machine</option>
              <option value="Foam Related Machine">Foam Related Machine</option>
              <option value="Quilting Machine">Quilting Machine</option>
              <option value="Stitching Machine">Stitching Machine</option>
              <option value="Tape Edge Machine">Tape Edge Machine</option>
              <option value="Spring Machine">Spring Machine</option>
            </select>
            {errors.machineType && <span className="error">{errors.machineType}</span>}
          </label>
          <label>
            Problem Description:
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
            />
            {errors.problemDescription && <span className="error">{errors.problemDescription}</span>}
          </label>
          <button type="submit" className="submit-btn">
            Send
          </button>
        </form>
      </div>
      {isPopupOpen && (
        <Popuppage
          isOpen={isPopupOpen}
          onRequestClose={() => {
            setIsPopupOpen(false);
          }}
          content={popupContent}
          onConfirm={() => {
            handleConfirmation();
          }}
        />
      )}
    </div>
  );
};

export default ServiceRequest;
