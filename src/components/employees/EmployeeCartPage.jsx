import { useCart } from '../CartContext';
import axios from 'axios';
import EmployeeNavBar from './EmployeeNavBar';
import { useUser } from '../../context/UserContext'; // Import UserContext to access userId

const EmployeeCartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { userId } = useUser(); // Access userId from UserContext

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

      const payload = {
        employeeId: userId, // Include the user's ID in the payload
        totalPrice: total,
        selectedItems,
      };

      console.log('🧪 ORDER DEBUG', {
        totalPrice: total,
        selectedItems,
        employeeId: userId
      });

      console.log('Sending order payload:', payload);
      await axios.post('https://leboba.onrender.com/api/orders', payload);

      alert('Order placed successfully!');
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      alert('There was an issue placing your order.');
    }
  };

  return (
    <>
      <EmployeeNavBar />

      <div style={{ padding: '20px' }}>
        <h2>Employee Cart</h2>

        {cartItems.length === 0 ? (
          <p>The cart is currently empty.</p>
        ) : (
          <>
            <ul>
              {cartItems.map((item, i) => (
                <li key={i} style={{ marginBottom: '15px' }}>
                  <strong>{item.item}</strong> — ${Number(item.price)?.toFixed(2)}<br />
                  Sweetness: {item.sweetness?.item || 'N/A'} | Ice: {item.ice?.item || 'N/A'}
                  {Array.isArray(item.toppings) && item.toppings.length > 0 && (
                    <div>Toppings: {item.toppings.map(t => t.item).join(', ')}</div>
                  )}
                  <br />
                  <button onClick={() => removeFromCart(i)}>Remove</button>
                </li>
              ))}
            </ul>

            <h3>Total: ${total.toFixed(2)}</h3>
            <div style={{ marginTop: '10px' }}>
              <button onClick={handlePlaceOrder}>Place Order</button>
              <button onClick={clearCart} style={{ marginLeft: '10px' }}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default EmployeeCartPage;