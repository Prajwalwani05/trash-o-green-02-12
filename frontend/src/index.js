import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { BookingProvider } from './context/BookingContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <UserProvider>
  <AuthProvider>
   <CartProvider>
   <BookingProvider>
    <App />
   </BookingProvider>
   </CartProvider>
  </AuthProvider>
    </UserProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
