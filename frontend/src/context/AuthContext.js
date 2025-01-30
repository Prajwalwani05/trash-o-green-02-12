import React, { useState, createContext, useContext, useEffect } from 'react';
import { useUser } from './UserContext';

// Create a context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        // Get the token from localStorage (if available) when the app loads
        return sessionStorage.getItem('token') || '';
      });
     const { clearUser } = useUser();
      // Save the token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token'); // Clean up when token is cleared
    }
  }, [token]);

  const logout = () => {
    setToken(''); // Clear token
    clearUser(); // Clear user data
  };


  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);