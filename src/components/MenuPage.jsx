import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAllergens } from '../context/AllergenContext';
import { allergenData, commonAllergens } from '../utils/allergens';
import './MenuPage.css';
import bobaImage from '../assets/boba.png'; // Add this import at the top

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { addToCart } = useCart();
  const { userAllergens, setUserAllergens } = useAllergens();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);


  // Update the default image URL to use local boba.png
  const defaultImageUrl = bobaImage;

  useEffect(() => {
    // Fetch all menu items when the page loads
    axios.get('https://leboba.onrender.com/api/menu/items')
      .then(res => {
        const allItems = res.data.filter(item => !isExcluded(item.item));
        setMenuItems(allItems);
        setFilteredItems(allItems); // Show all items initially
      })
      .catch(err => console.error('Failed to load menu items:', err));
  }, []);

  // Helper to determine if an item should be excluded (toppings, sugar, ice)
  const isExcluded = (name) => {
    const lowered = name.toLowerCase();
    return lowered.includes('sugar') || lowered.includes('ice') ||
           lowered.includes('popping') || lowered.includes('pearl') ||
           lowered.includes('jelly');
  };

  // Categorize menu items based on name
  const categorizeItem = (name) => {
    const lowered = name.toLowerCase();
    if (lowered.includes('milk tea')){
      return 'Milk Tea';
    } else if (lowered.includes('tea') || lowered.includes('lemonade')) {
      return 'Fruit Tea';
    } else {
      return 'Food';
    }
  };

  // Handle category button clicks to filter displayed items
  const handleCategoryClick = (category) => {
    if (category === 'All') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => categorizeItem(item.item) === category);
      setFilteredItems(filtered);
    }
  };

  // Add a menu item to the cart (with default options)
  const handleQuickAdd = (item) => {
    const isFood = categorizeItem(item.item) === 'Food'; // Check if the item is a food item
  
    const defaultItem = {
      ...item,
      sweetness: isFood ? null : { idmenu: 38, item: "Normal Sugar" }, // Add sweetness only if not food
      ice: isFood ? null : { idmenu: 35, item: "Normal Ice" },         // Add ice only if not food
      toppings: [], // No toppings by default
    };
  
    addToCart(defaultItem);
    alert(`Added ${item.item} to cart!`);
  };

  // Add allergen check function
  const checkAllergens = (itemName) => {
    const itemAllergens = allergenData[itemName] || [];
    const allergicTo = itemAllergens.filter(allergen => userAllergens.includes(allergen));
    return allergicTo;
  };

  // Add allergen warning component
  const AllergenWarning = ({ allergens }) => {
    if (allergens.length === 0) return null;
    
    return (
      <div className="allergen-warning">
        ⚠️ Contains: {allergens.join(', ')}
      </div>
    );
  };

  const emojiMap = {
    'Classic Milk Tea': '🧋',
    'Coconut Milk Tea': '🥥🧋',
    'Almond Milk Tea': '🌰🧋',
    'Matcha Milk Tea': '🍵',
    'Mango and Passion Fruit Tea': '🥭🍈',
    'Mango Green Tea': '🥭🍃',
    'Kiwi Fruit Tea': '🥝',
    'Tropical Fruit Tea': '🍍🍊',
    'Nutella Kaiyaki': '🍫🐟',
    'Crispy Puffs': '🥠',
    'Dumplings': '🥟',
    'Seasonal Tigers Blood Lemonade': '🍓🍉🍋',
  };
  
  return (
    <div
    className={`menu-page ${highContrast ? 'high-contrast' : ''}`}
    style={{ fontSize: `${fontSize}px` }}>


      <h2 className="menu-title">🍹 Select Your Menu Item</h2>
      <div className="accessibility-controls">
     <button onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}>A+</button>
    <button onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}>A−</button>
    <button onClick={() => setHighContrast(prev => !prev)}>
    {highContrast ? "Normal Mode" : "High Contrast"}
        </button>
    </div>

      {/* Add allergen selection */}
      <div className="allergen-selector">
        <h3>Select Your Allergens:</h3>
        <div className="allergen-options">
          {commonAllergens.map(allergen => (
            <label key={allergen} className="allergen-checkbox">
              <input
                type="checkbox"
                checked={userAllergens.includes(allergen)}
                onChange={(e) => {
                  const { checked } = e.target;
                  const newAllergens = checked
                    ? [...userAllergens, allergen]
                    : userAllergens.filter(a => a !== allergen);
                  setUserAllergens(newAllergens);
                }}
              />
              {allergen}
            </label>
          ))}
        </div>
      </div>

      {/* Category selection bar */}
      <div className="category-bar">
        <button onClick={() => handleCategoryClick('All')}>All</button>
        <button onClick={() => handleCategoryClick('Milk Tea')}>Milk Tea</button>
        <button onClick={() => handleCategoryClick('Fruit Tea')}>Fruit Tea</button>
        <button onClick={() => handleCategoryClick('Food')}>Food</button>
      </div>

      {/* Menu items grid */}
      <div className="menu-grid">
        {filteredItems.map(item => {
          const allergicTo = checkAllergens(item.item);
          return (
            <div 
              className={`menu-card ${allergicTo.length > 0 ? 'has-allergens' : ''}`} 
              key={item.idmenu}
            >
              <div className="emoji-icon">
                {emojiMap[item.item] || '🧋'}
              </div>
              <h4>{item.item}</h4>
              <AllergenWarning allergens={allergicTo} />
              <p>${Number(item.price).toFixed(2)}</p>
              <div className="menu-buttons">
                {/* Only show the "Customize" button if the item is not in the "Food" category */}
                {categorizeItem(item.item) !== 'Food' && (
                  <button onClick={() => navigate(`/customize/${item.idmenu}`)}>Customize</button>
                )}
                <button onClick={() => handleQuickAdd(item)}>Add to Cart</button>
              </div>
            </div>
          );
        })}
      </div> {/* closes .menu-page */}

      <div style={{ marginTop: '4rem', paddingLeft: '1rem' }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    </div> 
  );
}

export default MenuPage;