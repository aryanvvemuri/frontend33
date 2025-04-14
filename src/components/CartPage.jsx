import { useCart } from './CartContext';
import './CartPage.css';
import axios from 'axios';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  console.log('🧾 Current cart items:', cartItems); //debugging

  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const handlePlaceOrder = async () => {
  try {
    const allIds = cartItems.map(item => item.idmenu);
    const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);

    const orderPayload = {
      totalPrice: total,
      selectedItems: allIds  // just the array of idmenu values
    };

    console.log('📦 Final order to send:', orderPayload);

    await axios.post('https://leboba.onrender.com/api/carts/add', orderPayload);
    alert('✅ Order placed!');
    clearCart();
  } catch (err) {
    console.error('❌ Error placing order:', err);
    alert('Something went wrong placing your order.');
  }
};

    

  return (
    <div className="cart-page">
      <h2>🛒 Your Cart</h2>
      
    <p style={{ color: 'limegreen' }}> Cart page loading success</p>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item, i) => (
              <li key={i}>
                <strong>{item.item}</strong> - ${Number(item.price)?.toFixed(2)}
                <br />
                Sweetness: {item.sweetness || 'N/A'}, Ice: {item.ice || 'N/A'}
                {Array.isArray(item.toppings) && item.toppings.length > 0 && (
                  <div>Toppings: {item.toppings.join(', ')}</div>
                )}
                <button
                  onClick={() => {
                    console.log(`🗑️ Removing item at index ${i}:`, item);
                    removeFromCart(i);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h3>Total: ${total.toFixed(2)}</h3>

          <div className="cart-actions">
            <button onClick={handlePlaceOrder}>Place Order</button>
            <button
              onClick={() => {
                console.log('🧹 Clearing cart');
                clearCart();
              }}
            >
               Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;

