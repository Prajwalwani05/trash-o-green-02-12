import React, { useState, createContext, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        // Get the token from localStorage (if available) when the app loads
        return localStorage.getItem('token') || '';
      });
       // Save the token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token'); // Clean up when token is cleared
    }
  }, [token]);

  const logout = () => setToken('');


  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);