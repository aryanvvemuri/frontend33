import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAllergens } from '../context/AllergenContext';
import { allergenData, commonAllergens } from '../utils/allergens';
import './MenuPage.css';
import bobaImage from '../assets/boba.png';
import { useAccessibility } from '../context/AccessibilityContext'; // ✅ Use global accessibility

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { addToCart } = useCart();
  const { userAllergens, setUserAllergens } = useAllergens();
  const navigate = useNavigate();
  const { fontSize, highContrast } = useAccessibility(); // ✅ Pull values from context

  useEffect(() => {
    axios.get('https://leboba.onrender.com/api/menu/items')
      .then(res => {
        const allItems = res.data.filter(item => !isExcluded(item.item));
        setMenuItems(allItems);
        setFilteredItems(allItems);
      })
      .catch(err => console.error('Failed to load menu items:', err));
  }, []);

  const isExcluded = (name) => {
    const lowered = name.toLowerCase();
    return lowered.includes('sugar') || lowered.includes('ice') ||
           lowered.includes('popping') || lowered.includes('pearl') ||
           lowered.includes('jelly');
  };

  const categorizeItem = (name) => {
    const lowered = name.toLowerCase();
    if (lowered.includes('milk tea')) return 'Milk Tea';
    if (lowered.includes('tea') || lowered.includes('lemonade')) return 'Fruit Tea';
    return 'Food';
  };

  const handleCategoryClick = (category) => {
    if (category === 'All') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item => categorizeItem(item.item) === category);
      setFilteredItems(filtered);
    }
  };

  const handleQuickAdd = (item) => {
    const isFood = categorizeItem(item.item) === 'Food';
    const defaultItem = {
      ...item,
      sweetness: isFood ? null : { idmenu: 38, item: "Normal Sugar" },
      ice: isFood ? null : { idmenu: 35, item: "Normal Ice" },
      toppings: [],
    };
    addToCart(defaultItem);
    alert(`Added ${item.item} to cart!`);
  };

  const checkAllergens = (itemName) => {
    const itemAllergens = allergenData[itemName] || [];
    return itemAllergens.filter(a => userAllergens.includes(a));
  };

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
      style={{ fontSize: `${fontSize}px` }}
    >
      <h2 className="menu-title">🍹 Select Your Menu Item</h2>

      {/* ✅ Removed local accessibility controls */}

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

      <div className="category-bar">
        <button onClick={() => handleCategoryClick('All')}>All</button>
        <button onClick={() => handleCategoryClick('Milk Tea')}>Milk Tea</button>
        <button onClick={() => handleCategoryClick('Fruit Tea')}>Fruit Tea</button>
        <button onClick={() => handleCategoryClick('Food')}>Food</button>
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => {
          const allergicTo = checkAllergens(item.item);
          return (
            <div
              className={`menu-card ${allergicTo.length > 0 ? 'has-allergens' : ''}`}
              key={item.idmenu}
            >
              <div className="emoji-icon">{emojiMap[item.item] || '🧋'}</div>
              <h4>{item.item}</h4>
              <AllergenWarning allergens={allergicTo} />
              <p>${Number(item.price).toFixed(2)}</p>
              <div className="menu-buttons">
                {categorizeItem(item.item) !== 'Food' && (
                  <button onClick={() => navigate(`/customize/${item.idmenu}`)}>Customize</button>
                )}
                <button onClick={() => handleQuickAdd(item)}>Add to Cart</button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '4rem', paddingLeft: '1rem' }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default MenuPage;