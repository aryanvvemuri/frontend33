import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';
import './MenuPage.css';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all menu items when the page loads
    axios.get('http://localhost:3000/api/menu/items')
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
    if (lowered.includes('milk tea')) {
      return 'Milk Tea';
    } else if (lowered.includes('fruit tea') || lowered.includes('lemonade')) {
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
    const defaultItem = {
      ...item,
      sweetness: 'Regular',
      ice: 'Regular',
      toppings: [],
    };
    addToCart(defaultItem);
    alert(`Added ${item.item} to cart!`);
  };

  return (
    <div className="menu-page">
      <h2 className="menu-title">Explore Our Menu</h2>

      {/* Category selection bar */}
      <div className="category-bar">
        <button onClick={() => handleCategoryClick('All')}>All</button>
        <button onClick={() => handleCategoryClick('Milk Tea')}>Milk Tea</button>
        <button onClick={() => handleCategoryClick('Fruit Tea')}>Fruit Tea</button>
        <button onClick={() => handleCategoryClick('Food')}>Food</button>
      </div>

      {/* Menu items grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div className="menu-card" key={item.idmenu}>
            <h4>{item.item}</h4>
            <p>${Number(item.price).toFixed(2)}</p>
            <div className="menu-buttons">
              <button onClick={() => navigate(`/customize/${item.idmenu}`)}>Customize</button>
              <button onClick={() => handleQuickAdd(item)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;
