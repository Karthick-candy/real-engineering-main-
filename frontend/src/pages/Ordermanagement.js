import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Ordermanagement.css';  // Include for styling

const API_URL = 'http://localhost:8000';

// OrderCard Component to Display Individual Orders
const OrderCard = ({ order, orderType, onClose }) => {
  // Format the order date
  const orderDate = new Date(order.created_at).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour format
  }) || 'N/A';

  return (
    <div className="order-card">
      <h3 className="product-name">{order.product_name}</h3>
      <p><strong>Name:</strong> {order.user_name}</p>
      <p><strong>Company:</strong> {order.company_name}</p>
      <p><strong>Address:</strong> {order.company_address}</p>
      <p><strong>Phone:</strong> {order.company_phone}</p>
      {/* Conditionally show fields based on order type */}
      {orderType === 'spring' && (
        <>
          <p><strong>Spring Size:</strong> {order.spring_size}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Price per Unit:</strong> ₹{order.price_per_unit}</p>
        </>
      )}
      {orderType !== 'spring' && (
        <p><strong>Price:</strong> ₹{order.price}</p>
      )}
      <p className="order-date"><strong>Order Date:</strong> {orderDate}</p>
      <button className="close-btn" onClick={() => onClose(order.id)}>Close Order</button>
    </div>
  );
};

// OrderList Component to Fetch and Display Orders by Category
const OrderList = ({ orderType, apiEndpoint, title }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Fetch Orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setOrders(response.data);
      } catch (err) {
        // Set detailed error message
        setError(`Failed to fetch orders: ${err.response ? err.response.data.message : 'Network error. Please try again later.'}`);
        console.error(err);
        setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
      }
    };

    fetchOrders();
  }, [apiEndpoint]);

  // Close an Order (moves to closed orders section)
  const closeOrder = async (id) => {
    try {
      await axios.post(`/close_order/${orderType}/${id}/`); // Ensure this endpoint exists
      setOrders(orders.filter(order => order.id !== id));  // Remove closed order from open list
    } catch (err) {
      // Set detailed error message
      setError(`Failed to close order: ${err.response ? err.response.data.message : 'Network error. Please try again later.'}`);
      console.error(err);
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    }
  };

  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const displayedOrders = showAll ? orders : orders.slice(0, 3);

  return (
    <div className="order-list-section">
      <h2>{title}</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="order-list">
        {displayedOrders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          displayedOrders.map(order => (
            <OrderCard key={order.id} order={order} orderType={orderType} onClose={closeOrder} />
          ))
        )}
      </div>
      {orders.length > 3 && !showAll && (
        <button className="see-all-btn" onClick={handleShowAll}>See All Orders &rarr;</button>
      )}
      {showAll && (
        <button className="see-all-btn" onClick={handleShowAll}>Show Less &larr;</button>
      )}
    </div>
  );
};

// Main OrderManagement Component
const OrderManagement = () => {
  return (
    <div className="order-management">
      {/* Spring Orders Section */}
      <OrderList
        orderType="spring"
        apiEndpoint={`${API_URL}/api/get_spring_orders_list/`}
        title="Spring Orders"
      />

      {/* Accessory Orders Section */}
      <OrderList
        orderType="accessory"
        apiEndpoint={`${API_URL}/api/get_accessory_orders_list/`}
        title="Accessory Orders"
      />

      {/* Machinery Orders Section */}
      <OrderList
        orderType="machinery"
        apiEndpoint={`${API_URL}/api/get_machinery_orders_list/`}
        title="Machinery Orders"
      />
    </div>
  );
};

export default OrderManagement;
