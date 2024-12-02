import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const TokenHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin'); // Redirect if no token
      return;
    }

    // Decode the token to get the expiration time
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      const timeUntilExpiry = decoded.exp - currentTime;

      if (timeUntilExpiry <= 0) {
        // Token already expired
        localStorage.removeItem('token');
        navigate('/signin');
      } else {
        // Set a timeout to redirect just before the token expires
        const timer = setTimeout(() => {
          localStorage.removeItem('token');
          navigate('/signin');
        }, timeUntilExpiry * 1000); // Convert to milliseconds

        // Clean up timeout on unmount
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem('token'); // Remove invalid token
      navigate('/signin');
    }
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default TokenHandler;
