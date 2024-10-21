import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Product.css';

const API_URL = 'http://localhost:8000'; // Adjust as needed

const Products = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products_for_public/`);
        const groupedProducts = response.data.reduce((acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        }, {});
        setProducts(groupedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-page">
      <header>
        <h1>Our Products & Machineries</h1>
      </header>
      <section>
        {Object.keys(products).map((category) => (
          <div key={category} className="category-section">
            <h2>{category}</h2>
            <div className="products-section">
              {products[category].map((product) => (
                <div key={product.id} className="product-items">
                  <div className="product-header">
                    <Link to={`/order`} state={{ product }}>
                      <h3>{product.name}</h3>
                    </Link>
                  </div>                                                
                  <div className="product-body">
                    <Link to={`/order`} state={{ product }}>
                      <img src={product.image} alt={product.name} className="product-image" />
                    </Link>
                    <p className="product-price">₹ {product.price} / unit</p>
                    <Link to={`/order-form`} state={{ product }}>
                      <button className="buy-now">Buy Now</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Products;
