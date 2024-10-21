import React from 'react';
import Imageslider from '../components/Imageslider';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <main>
        <Imageslider />
      </main>
      <header className="hero">
        <div className="hero-content">
          <h1>Welcome to Real Engineering</h1>
          <p>Your trusted partner in mattress spring manufacturing and services.</p>
          <a href="/products" className="hero-btn">Shop Now</a>
        </div>
      </header>
      
      <section className="about">
        <h2>About Us</h2>
        <p>
          At Real Engineering, we specialize in manufacturing high-quality mattress springs and providing top-notch services to our clients. With years of experience in the industry, we pride ourselves on our commitment to excellence and customer satisfaction.
        </p>
      </section>

      <section className="products-overview">
        <h2>Our Products</h2>
        <div className="product-list">
          <div className="product-item">
            <h3>Bonnell Springs</h3>
            <p>High-quality Bonnell springs for durable and comfortable mattresses.</p>
          </div>
          <div className="product-item">
            <h3>Pocket Springs</h3>
            <p>Individually wrapped pocket springs for superior support and motion isolation.</p>
          </div>
          <div className="product-item">
            <h3>Continuous Coil Springs</h3>
            <p>Continuous coil springs for consistent support and long-lasting comfort.</p>
          </div>
        </div>
      </section>

      <section className="services-overview">
        <h2>Our Services</h2>
        <div className="service-list">
          <div className="service-item">
            <h3>Custom Spring Design</h3>
            <p>Tailored solutions to meet your specific mattress spring needs.</p>
          </div>
          <div className="service-item">
            <h3>Manufacturing Consultation</h3>
            <p>Expert advice and consultation for your mattress manufacturing process.</p>
          </div>
          <div className="service-item">
            <h3>Quality Assurance</h3>
            <p>Comprehensive quality checks to ensure the highest standards.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
