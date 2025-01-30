import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(sessionStorage.getItem('cart')) || []);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Check if product already exists in the cart
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 } // Increment quantity
            : item
        );
      }
      // Add new product to the cart
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    setCart((prevCart) => {
      if (!Array.isArray(prevCart)) {
        return []; // Handle unexpected state
      }
      return prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity } // Update the quantity
          : item
      );
    });
  };
  
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
        if (!Array.isArray(prevCart)) {
          return []; // Handle unexpected state
        }
        return prevCart.filter(product => product.id !== productId);
      });
      };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, clearCart, addToCart, removeFromCart, clearCart, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
export default CartContext;

export const useCart = () => {
    return useContext(CartContext);
  };
  