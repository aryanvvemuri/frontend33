import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';

function NavBar({ userName, setUserName, userEmail, setUserEmail }) {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const navigate = useNavigate();

  const approvedManagers = [
    'tylerr13@tamu.edu',
    'ranchhodshiv@tamu.edu',
    'avv123@tamu.edu',
    'harsh_jan@tamu.edu',
  ];

  const handleLogout = () => {
    setUserName(null);
    setUserEmail(null);
    navigate('/');
  };

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.querySelector('script[src*="translate.google.com"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  const isManager = userEmail && approvedManagers.includes(userEmail.toLowerCase());

  return (
    <nav className="nav-bar">
      {/* Google Translate Dropdown */}
      <div id="google_translate_element" className="translate-dropdown"></div>

      {/* Display user's name */}
      <div className="nav-links">
        {userName && <span className="welcome-name">Welcome, {userName}!</span>}
      </div>

      {/* Navigation links */}
      <div className="nav-links">
        <Link to="/menu/1">Menu</Link>
        <Link to="/cart">Cart</Link>
        {isManager && (
          <>
            <Link to="/manager">Manager</Link>
            <Link to="/employee">Employee</Link>
          </>
        )}
        {userName ? (
          <button onClick={handleLogout} className="logout-link">Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* Weather information */}
      <div className="weather-info">
        {weatherError ? (
          <span>Error loading weather</span>
        ) : weather ? (
          <span>
            🌡 {Math.round(9 / 5 * (weather.main?.temp) + 32)}°F |{' '}
            {weather.weather?.[0]?.description}
          </span>
        ) : (
          <span>Loading weather...</span>
        )}
      </div>
    </nav>
  );
}

export default NavBar;