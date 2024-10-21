// src/components/ImageSlider.js

import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/Imageslider.css'; // Adjust path as per your project structure
import matressimg1 from '../images/matressimg1.jpg';
import matressimg2 from '../images/matressimg2.jpg';
import matressimg3 from '../images/matressimg3.jpg';

const Imageslider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 500,
    nextArrow: <div className="slick-next"></div>,
    prevArrow: <div className="slick-prev"></div>,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src={matressimg1} alt="Slide 1" className="slider-image" />
        </div>
        <div>
          <img src={matressimg2} alt="Slide 2" className="slider-image" />
        </div>
        <div>
          <img src={matressimg3} alt="Slide 3" className="slider-image" />
        </div>
      </Slider>
    </div>
  );
};

export default Imageslider;
