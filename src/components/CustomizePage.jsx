import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomizePage.css';
import { useCart } from '../components/CartContext';

const CustomizePage = () => {
  const { id } = useParams();
  const { addToCart } = useCart(); // Hook from CartContext

  const [item, setItem] = useState(null); // Current item
  const [menuItems, setMenuItems] = useState([]); // All menu items for filtering toppings
  const [sweetness, setSweetness] = useState('100%');
  const [ice, setIce] = useState('Normal Ice');
  const [toppings, setToppings] = useState([]);

  // 1. Fetch the drink being customized
  useEffect(() => {
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }

    axios
      .get(`http://localhost:3000/api/menu/item/${id}`)
      .then((res) => setItem(res.data))
      .catch((err) => console.error('Failed to fetch item:', err));
  }, [id]);

  // 2. Fetch full menu to extract topping options
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/menu/items')
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error('Failed to fetch menu items:', err));
  }, []);

  // 3. Extract topping items by name
  const toppingOptions = menuItems.filter(
    (m) =>
      m.item.toLowerCase().includes('tapioca') ||
      m.item.toLowerCase().includes('popping') ||
      m.item.toLowerCase().includes('jelly')
  );

  // 4. Toggle toppings (we use item.id or item.item for uniqueness)
  const toggleTopping = (topping) => {
    if (toppings.some((t) => t.item === topping.item)) {
      setToppings(toppings.filter((t) => t.item !== topping.item));
    } else {
      setToppings([...toppings, topping]);
    }
  };

  // 5. Add custom drink to cart
  const handleAddToCart = () => {
    const customDrink = {
      ...item,
      sweetness,
      ice,
      toppings,
    };

    addToCart(customDrink);
    console.log('Added to cart:', customDrink);
  };

  // Handle loading state
  if (!item) return <div>Loading...</div>;

  return (
    <div className="customize-page">
      <h2>🛠 Customize {item.item}</h2>
      <p>{typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : 'Price unavailable'}</p>

      <div className="custom-section">
        <label>Sweetness:</label>
        <select value={sweetness} onChange={(e) => setSweetness(e.target.value)}>
          <option value="0%">0%</option>
          <option value="50%">50%</option>
          <option value="100%">100%</option>
          <option value="125%">125%</option>
        </select>
      </div>

      <div className="custom-section">
        <label>Ice Level:</label>
        <select value={ice} onChange={(e) => setIce(e.target.value)}>
          <option>No Ice</option>
          <option>Less Ice</option>
          <option>Normal Ice</option>
          <option>More Ice</option>
        </select>
      </div>

      <div className="custom-section">
        <label>Toppings:</label>
        {toppingOptions.map((top, i) => (
          <div key={i}>
            <input
              type="checkbox"
              checked={toppings.some((t) => t.item === top.item)}
              onChange={() => toggleTopping(top)}
            />
            <span>{top.item}</span>
          </div>
        ))}
      </div>

      <button className="add-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default CustomizePage;