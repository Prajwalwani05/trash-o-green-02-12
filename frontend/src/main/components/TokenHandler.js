import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import without curly braces

const TokenHandler = () => {
  useEffect(() => {
    const token = sessionStorage.getItem('token');

    // Check if the token exists and is a string
    if (token && typeof token === 'string') {
      try {
        // Decode the token to check the expiration time
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        const timeUntilExpiry = decoded.exp - currentTime;

        // Check if the token is expired
        if (timeUntilExpiry <= 0) {
          // Token has already expired, remove it from sessionStorage
          sessionStorage.removeItem('token');
        } else {
          // Set a timeout to remove the token when it expires
          const timer = setTimeout(() => {
            sessionStorage.removeItem('token');
          }, timeUntilExpiry * 1000); // Convert to milliseconds

          // Clean up timeout on unmount or when token changes
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Remove invalid token if decoding fails
        sessionStorage.removeItem('token');
      }
    } else {
      console.error("Token is missing or invalid");
    }
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

  return null; // This component doesn't render anything
};

export default TokenHandler;
