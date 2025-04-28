import { useCart } from './CartContext';
import './CartPage.css';
import axios from 'axios';
import { useState } from 'react';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false); // State to show the banner

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
        totalPrice: total,
        selectedItems, // e.g. [2, 39, 36, 10, 12]
      };

      console.log('Sending order payload:', payload);
      await axios.post('https://leboba.onrender.com/api/orders', payload);

      setOrderPlaced(true); // Show the banner
      clearCart(); // Clear the cart
      setTimeout(() => setOrderPlaced(false), 3000); // Hide the banner after 3 seconds
    } catch (err) {
      console.error('Error placing order:', err);
      alert('There was an issue placing your order.');
    }
  };

  return (
    <div className="cart-page">
      {orderPlaced && (
        <div className="order-banner">
          Order Placed Successfully!
        </div>
      )}
      <h2>🛒 Your Cart</h2>
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