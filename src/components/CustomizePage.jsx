import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './CustomizePage.css';
import { useCart } from './CartContext';

const CustomizePage = () => {
  // Get the drink ID from the URL parameters
  const { id } = useParams();
  const { addToCart } = useCart(); // Use the custom cart context to add items
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Local state for the selected item, full menu items list, and customization options
  const [item, setItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [sweetness, setSweetness] = useState({ idmenu: 38, item: "Normal Sugar" });
  const [ice, setIce] = useState({ idmenu: 35, item: "Normal Ice" });
  const [toppings, setToppings] = useState([]);

  // Fetch menu items and the specific item to customize when the page loads
  useEffect(() => {
    axios.get('http://localhost:3000/api/menu/items')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error('Failed to fetch menu items:', err));

    axios.get(`http://localhost:3000/api/menu/item/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error('Failed to fetch item:', err));
  }, [id]);

  // Filter menu items to find all available toppings
  const toppingOptions = menuItems.filter(m =>
    m.item.toLowerCase().includes('tapioca') ||
    m.item.toLowerCase().includes('popping') ||
    m.item.toLowerCase().includes('jelly')
  );

  // Define sugar level options
  const sugarOptions = {
    "0%": { idmenu: 40, item: "No Sugar" },
    "25%": { idmenu: 37, item: "Less Sugar" },
    "50%": { idmenu: 39, item: "Half Sugar" },
    "100%": { idmenu: 38, item: "Normal Sugar" }
  };

  // Define ice level options
  const iceOptions = {
    "No Ice": { idmenu: 41, item: "No Ice" },
    "Less Ice": { idmenu: 34, item: "Less Ice" },
    "Half Ice": { idmenu: 36, item: "Half Ice" },
    "Normal Ice": { idmenu: 35, item: "Normal Ice" }
  };

  // Toggle topping selection
  const toggleTopping = (topping) => {
    if (toppings.some(t => t.idmenu === topping.idmenu)) {
      // If topping is already selected, remove it
      setToppings(toppings.filter(t => t.idmenu !== topping.idmenu));
    } else {
      // Otherwise, add it
      setToppings([...toppings, topping]);
    }
  };

  // Handle adding the customized item to the cart
  const handleAddToCart = () => {
    if (!item) return;

    const customDrink = {
      idmenu: item.idmenu,
      item: item.item,
      price: Number(item.price),
      sweetness: sweetness,
      ice: ice,
      toppings: toppings,
    };

    addToCart(customDrink); // Add drink to cart
    navigate('/cart');      // Redirect to cart page
  };

  // Display loading state if item details are not fetched yet
  if (!item) return <div>Loading...</div>;

  return (
    <div className="customize-page">
      <h2>🛠 Customize {item.item}</h2>
      <p>${Number(item.price).toFixed(2)}</p>

      {/* Sweetness selection */}
      <div className="custom-section">
        <label>Sweetness:</label>
        <select
          onChange={(e) => setSweetness(sugarOptions[e.target.value])}
          value={Object.keys(sugarOptions).find(key => sugarOptions[key].idmenu === sweetness.idmenu)}
        >
          <option value="0%">0% (No Sugar)</option>
          <option value="25%">25% (Less Sugar)</option>
          <option value="50%">50% (Half Sugar)</option>
          <option value="100%">100% (Normal Sugar)</option>
        </select>
      </div>

      {/* Ice level selection */}
      <div className="custom-section">
        <label>Ice Level:</label>
        <select
          onChange={(e) => setIce(iceOptions[e.target.value])}
          value={Object.keys(iceOptions).find(key => iceOptions[key].idmenu === ice.idmenu)}
        >
          <option value="No Ice">No Ice</option>
          <option value="Less Ice">Less Ice</option>
          <option value="Half Ice">Half Ice</option>
          <option value="Normal Ice">Normal Ice</option>
        </select>
      </div>

      {/* Toppings selection */}
      <div className="custom-section">
        <label>Toppings:</label>
        {toppingOptions.map((top, i) => (
          <div key={i}>
            <input
              type="checkbox"
              checked={toppings.some(t => t.idmenu === top.idmenu)}
              onChange={() => toggleTopping(top)}
            />
            <span>{top.item}</span>
          </div>
        ))}
      </div>

      {/* Add to cart button */}
      <button className="add-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default CustomizePage;
