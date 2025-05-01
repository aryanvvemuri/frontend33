import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import EmployeeNavBar from './EmployeeNavBar'; // Optional if you want nav on top

const EmployeeCustomizePage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [sweetness, setSweetness] = useState({ idmenu: 38, item: "Normal Sugar" });
  const [ice, setIce] = useState({ idmenu: 35, item: "Normal Ice" });
  const [toppings, setToppings] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    axios.get('https://leboba.onrender.com/api/menu/items')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error('Failed to fetch menu items:', err));

    axios.get(`https://leboba.onrender.com/api/menu/item/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.error('Failed to fetch item:', err));
  }, [id]);

  const toppingOptions = menuItems.filter(m =>
    m.item.toLowerCase().includes('tapioca') ||
    m.item.toLowerCase().includes('popping') ||
    m.item.toLowerCase().includes('jelly')
  );

  const sugarOptions = {
    "0%": { idmenu: 40, item: "No Sugar" },
    "25%": { idmenu: 37, item: "Less Sugar" },
    "50%": { idmenu: 39, item: "Half Sugar" },
    "100%": { idmenu: 38, item: "Normal Sugar" }
  };

  const iceOptions = {
    "No Ice": { idmenu: 41, item: "No Ice" },
    "Less Ice": { idmenu: 34, item: "Less Ice" },
    "Half Ice": { idmenu: 36, item: "Half Ice" },
    "Normal Ice": { idmenu: 35, item: "Normal Ice" }
  };

  const toggleTopping = (topping) => {
    if (toppings.some(t => t.idmenu === topping.idmenu)) {
      setToppings(toppings.filter(t => t.idmenu !== topping.idmenu));
    } else {
      setToppings([...toppings, topping]);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;

    const customDrink = {
      idmenu: item.idmenu,
      item: item.item,
      price: Number(item.price),
      sweetness,
      ice,
      toppings,
    };

    addToCart(customDrink);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  if (!item) return <div>Loading...</div>;

  return (
    <>
      <EmployeeNavBar />

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: 'white' }}>Customize {item.item}</h2>
        <p>Price: ${Number(item.price).toFixed(2)}</p>

        {/* Sweetness */}
        <div style={{ marginBottom: '15px' }}>
          <label>Sweetness: </label>
          <select
            onChange={(e) => setSweetness(sugarOptions[e.target.value])}
            value={Object.keys(sugarOptions).find(key => sugarOptions[key].idmenu === sweetness.idmenu)}
          >
            {Object.entries(sugarOptions).map(([key, val]) => (
              <option key={val.idmenu} value={key}>{key}</option>
            ))}
          </select>
        </div>

        {/* Ice */}
        <div style={{ marginBottom: '15px' }}>
          <label>Ice Level: </label>
          <select
            onChange={(e) => setIce(iceOptions[e.target.value])}
            value={Object.keys(iceOptions).find(key => iceOptions[key].idmenu === ice.idmenu)}
          >
            {Object.entries(iceOptions).map(([key, val]) => (
              <option key={val.idmenu} value={key}>{key}</option>
            ))}
          </select>
        </div>

        {/* Toppings */}
        <div style={{ marginBottom: '15px' }}>
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

        {showConfirmation && <p>✅ Added to cart!</p>}

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={handleAddToCart} style={{ marginLeft: '10px' }}>
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
};

export default EmployeeCustomizePage;
