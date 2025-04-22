import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ userName, setUserName }) {
  const handleLogout = () => {
    setUserName(null); // Clear the user's name to log out
  };

  return (
    <nav className="nav-bar">

      {/* Display user's name styled like buttons */}
      <div className="nav-links">
        {userName && <span className="welcome-name">Welcome, {userName}!</span>}
      </div>

      {/* Navigation links */}
      <div className="nav-links">
        <Link to="/menu/1">Menu</Link>
        <Link to="/cart">Cart</Link>
        {userName ? (
          <button onClick={handleLogout} className="logout-link">Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/manager">Manager</Link>
      </div>
    </nav>
  );
}

export default NavBar;