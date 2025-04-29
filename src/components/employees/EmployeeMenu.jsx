import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../CartContext'; // shared cart context
import EmployeeNavBar from './EmployeeNavBar';

function EmployeeMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

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
    if (lowered.includes('milk tea')) {
      return 'Milk Tea';
    } else if (lowered.includes('tea') || lowered.includes('lemonade')) {
      return 'Fruit Tea';
    } else {
      return 'Food';
    }
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
    const defaultItem = {
      ...item,
      sweetness: { idmenu: 38, item: "Normal Sugar" },
      ice: { idmenu: 35, item: "Normal Ice" },
      toppings: [],
    };
    addToCart(defaultItem);
    alert(`Added ${item.item} to cart!`);
  };

  return (
    <>
      <EmployeeNavBar />

      <div style={{ padding: '20px' }}>
        <h2>Employee Menu</h2>

        {/* Category buttons */}
        <div style={{ marginBottom: '20px' }}>
          {['All', 'Milk Tea', 'Fruit Tea', 'Food'].map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)} style={{ marginRight: '10px' }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Menu table */}
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.idmenu}>
                <td>{item.item}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td>
                  {categorizeItem(item.item) !== 'Food' && (
                    <button onClick={() => navigate(`/employee/customize/${item.idmenu}`)}>
                      Customize
                    </button>
                  )}
                  <button onClick={() => handleQuickAdd(item)} style={{ marginLeft: '10px' }}>
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button style={{ marginTop: '20px' }} onClick={() => navigate('/')}>Back</button>
      </div>
    </>
  );
}

export default EmployeeMenu;
