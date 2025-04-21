import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext'; //Import cart hook
import './MenuPage.css';

function MenuPage() {
  const { categoryId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useCart(); //Use addToCart from context
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://leboba.onrender.com/api/menu/items')
      .then(res => setMenuItems(res.data))
      .catch(err => console.error('Failed to load menu items:', err));
  }, []);

  const excludeKeywords = ['sugar', 'ice', 'popping', 'pearl', 'jelly'];

  const filteredMenuItems = menuItems.filter(item => {
    const name = item.item.toLowerCase();
    return !excludeKeywords.some(keyword => name.includes(keyword));
  });

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
      <h2>🍹 Select Your Menu Item</h2>
      <div className="menu-grid">
        {filteredMenuItems.map(item => (
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
      <button className="back-btn" onClick={() => navigate('/')}> Back</button>
    </div>
  );
}

export default MenuPage;
