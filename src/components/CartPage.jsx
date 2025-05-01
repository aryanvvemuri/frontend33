import { useCart } from './CartContext';
import './CartPage.css';
import axios from 'axios';
import React from 'react';
import { useUser } from '../context/UserContext'; // Access userId
import { useAccessibility } from '../context/AccessibilityContext'; // ✅ Use global accessibility settings

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { userId } = useUser();
  const { fontSize, highContrast } = useAccessibility(); // ✅ Use global font/contrast

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handlePlaceOrder = async () => {
    try {
      const selectedItems = cartItems.flatMap(item => {
        const ids = [];
        if (item.baseId) {
          ids.push(item.baseId);
        } else if (item.idmenu) {
          ids.push(item.idmenu);
        }
        if (item.sweetness?.idmenu) {
          ids.push(item.sweetness.idmenu);
        }
        if (item.ice?.idmenu) {
          ids.push(item.ice.idmenu);
        }
        if (Array.isArray(item.toppings)) {
          ids.push(...item.toppings.map(t => t.idmenu));
        }
        return ids;
      });

      const employeeIdToUse = userId || 1;

      const payload = {
        employeeId: employeeIdToUse,
        totalPrice: total,
        selectedItems,
      };

      console.log('Sending order payload:', payload);
      console.log('User ID:', userId);
      console.log('Selected items:', selectedItems);
      await axios.post('https://leboba.onrender.com/api/orders', payload);

      alert('Order placed successfully!');
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      alert('There was an issue placing your order.');
    }
  };

  return (
    <div
      className={`cart-page ${highContrast ? 'high-contrast' : ''}`}
      style={{ fontSize: `${fontSize}px` }}
    >
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
                {item.sweetness?.item && <span>Sweetness: {item.sweetness.item}</span>}
                {item.ice?.item && <span> · Ice: {item.ice.item}</span>}
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
