import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext'; // Assuming same shared context
import './EmployeeNavBar.css';

function EmployeeNavBar() {
  const { cartItems } = useCart();

  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <Link to="/employee/menu">Menu</Link>
        <Link to="/employee/cart">
          Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </Link>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
}

export default EmployeeNavBar;