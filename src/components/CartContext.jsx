import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  //loading from localstorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('leboba-cart');
    return saved ? JSON.parse(saved) : [];
  });

  //saving to localstorage
  useEffect(() => {
    localStorage.setItem('leboba-cart', JSON.stringify(cartItems)); // you can think of it as cookies in a way
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => { // clear cart function
    setCartItems([]); 
    localStorage.removeItem('leboba-cart'); // clear storage too
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
