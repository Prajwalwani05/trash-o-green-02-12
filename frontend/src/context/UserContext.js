// UserContext.js
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the user data
const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notification , setNotification] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch('/api/users/profile', {
              headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          const decodedTokenData = jwtDecode(token)
          setUser(decodedTokenData);
          console.log(user);
          
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);
  
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, notification, setNotification }}>
      {children}
    </UserContext.Provider>
  );
};
