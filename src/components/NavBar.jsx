import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link">🧋 LeBoba</Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/about' ? 'active' : ''}>
          <Link to="/about">About</Link>
        </li>
        <li className={location.pathname.startsWith('/menu') ? 'active' : ''}>
          <Link to="/menu/1">Menu</Link>
        </li>
        <li className={location.pathname === '/cart' ? 'active' : ''}>
          <Link to="/cart">Cart</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

