import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  // Handle toggle for mobile menu
  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle visibility of settings dropdown based on current location
  useEffect(() => {
    if (location.pathname === '/admin-login') {
      setSettingsOpen(true);
    } else {
      setSettingsOpen(false);
    }
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" end>Real Engineering</NavLink>
      </div>
      <div className="navbar-icon" onClick={handleToggle}>
        <span className="navbar-icon-line"></span>
        <span className="navbar-icon-line"></span>
        <span className="navbar-icon-line"></span>
      </div>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleToggle}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/aboutus" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleToggle}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleToggle}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleToggle}>
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/contactus" className={({ isActive }) => (isActive ? 'active' : '')} onClick={handleToggle}>
            Contact Us
          </NavLink>
        </li>
      </ul>
      <div className="navbar-settings">
        <FontAwesomeIcon icon={faCog} onMouseEnter={() => setSettingsOpen(true)} />
        {settingsOpen && (
          <div className="navbar-settings-dropdown">
            <NavLink to="/admin-login" onClick={handleToggle}>Admin Login</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
