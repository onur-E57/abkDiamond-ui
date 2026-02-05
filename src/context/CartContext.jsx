import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('abk_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('abk_cart', JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (id, size) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
      )
    );
  };

  const decreaseQuantity = (id, size) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
      )
    );
  };

  const addToCart = (product, size) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => 
        String(item.id) === String(product.id) && item.size === size
      );

      if (existingItem) {
        return prevCart.map((item) =>
          String(item.id) === String(product.id) && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, size, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id, size) => {
    setCart((prevCart) => prevCart.filter(item => !(String(item.id) === String(id) && item.size === size)));
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        totalItems,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);