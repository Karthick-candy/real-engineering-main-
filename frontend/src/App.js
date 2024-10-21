import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Contactus from "./pages/Contactus";
import AboutUs from "./pages/Aboutus";
import AdminLogin from "./pages/Adminlogin";
import AdminRegister from "./pages/Adminregister";
import AdminDashboard from "./pages/Admindashboard";
import ProductManagement from "./pages/Productmanagement";
import OrderForm from "./pages/Orderform";
import OrderManagement from "./pages/Ordermanagement";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard/admin-register" element={<AdminRegister />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-dashboard/product-management" element={<ProductManagement />} />
        <Route path="/order-form" element={<OrderForm />} />
        <Route path="/admin-dashboard/order-management" element={<OrderManagement />} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;