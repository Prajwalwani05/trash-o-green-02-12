import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import axios from "axios";
import "../../index.css";
import { useNavigate } from "react-router-dom";

function CarouselProducts() {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/products/getAllProducts`);
      console.log(response.data);  // Log the response to check its structure
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
        console.log(response.data)
      } else {
        // setError("No products found");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const [springProps, api] = useSpring(() => ({ x: 0 }));
  const bind = useDrag(({ offset: [x] }) => {
    api.start({ x });
  });

  const getTransform = (index) => {
    const offset = index - activeIndex;
    const translateX = offset * 210;
    const scale = offset === 0 ? 1 : 0.8; // Scale non-active items
    const opacity = offset === 0 ? 1 : 0.5; // Make non-active items transparent
    return { translateX, scale, opacity };
  };

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  // Automatically scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 1500); // Adjust the interval duration as needed

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [products]);
  const navigate = useNavigate();
  return (
    <div className="carousel-container">
      <div className="carousel-wrapper" {...bind()}>
        {products.map((item, index) => {
          // Check if the item has an image property
          const { translateX, scale, opacity } = getTransform(index);
          return (
            <animated.div
              key={index}
              className="carousel-item"
              onClick={() => navigate('/products')}
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                backgroundImage: item.image ? `url(${item.image})` : 'none', // Add a fallback if image is not defined
              }}
            ></animated.div>
          );
        })}
      </div>
    </div>
  );
}

export default CarouselProducts;
