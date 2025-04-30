import { useCart } from './CartContext';
import './CartPage.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; // Import the UserContext

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const { userId } = useUser(); // Access userId from UserContext

  // Compute total price
  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  
  const handlePlaceOrder = async () => {
    try {
      // Build one big array of all idmenu values (base + sweetness + ice + toppings)
      const selectedItems = cartItems.flatMap(item => {
        const ids = [];
        // base drink
        if (item.baseId) {
          ids.push(item.baseId);
        } else if (item.idmenu) {
          ids.push(item.idmenu);
        }
        // sweetness choice
        if (item.sweetness?.idmenu) {
          ids.push(item.sweetness.idmenu);
        }
        // ice choice
        if (item.ice?.idmenu) {
          ids.push(item.ice.idmenu);
        }
        // any toppings
        if (Array.isArray(item.toppings)) {
          ids.push(...item.toppings.map(t => t.idmenu));
        }
        return ids;
      });

      const payload = {
        employeeId: userId,
        totalPrice: total,
        selectedItems,   // e.g. [2, 39, 36, 10, 12]
      };

      console.log(' Sending order payload:', payload);
      console.log(' User ID:', userId); // Log the userId to check if it's being passed correctly
      console.log(' Selected items:', selectedItems); // Log the selected items
      await axios.post('https://leboba.onrender.com/api/orders', payload);

      alert(' Order placed successfully!'); //confirmation so we dont have to check the database
      clearCart();
    } catch (err) {
      console.error(' Error placing order:', err);
      alert('There was an issue placing your order.');
    }
  };

  return (
    <div
  className={`cart-page ${highContrast ? 'high-contrast' : ''}`}
  style={{ fontSize: `${fontSize}px` }}
>
<div className="accessibility-controls">
  <button onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}>A+</button>
  <button onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}>A−</button>
  <button onClick={() => setHighContrast(prev => !prev)}>
    {highContrast ? "Normal Mode" : "High Contrast"}
  </button>
</div>
      <h2 className="cart-title">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, i) => (
              <li key={i}>
                <strong>{item.item}</strong> — ${Number(item.price)?.toFixed(2)}
                <br />
                Sweetness: {item.sweetness?.item || 'N/A'} · Ice: {item.ice?.item || 'N/A'}
                {Array.isArray(item.toppings) && item.toppings.length > 0 && (
                  <div>
                    Toppings: {item.toppings.map(t => t.item).join(', ')}
                  </div>
                )}
                <button onClick={() => removeFromCart(i)}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total: ${total.toFixed(2)}</h3>
          <div className="cart-actions">
            <button onClick={handlePlaceOrder}>Place Order</button>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
