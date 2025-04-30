import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import './EmployeeNavBar.css';

function EmployeeNavBar() {
  const { cartItems } = useCart();

  const handleHomeClick = (e) => {
    e.preventDefault(); // Prevent SPA navigation
    window.location.href = '/'; // ✅ Full reload to reinitialize Google Translate
  };

  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <Link to="/employee/menu">Menu</Link>
        <Link to="/employee/cart">
          Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </Link>
        <Link to="/" onClick={handleHomeClick}>Home</Link>
      </div>
    </nav>
  );
}

export default EmployeeNavBar;
