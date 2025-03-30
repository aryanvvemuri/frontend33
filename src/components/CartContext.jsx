import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Load from localStorage on first load
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('leboba-cart');
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('leboba-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('leboba-cart'); // ✅ clear storage too
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
