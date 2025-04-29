import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext'; // Import the cart context
import './NavBar.css';

function NavBar({ userName, setUserName, userEmail, setUserEmail }) {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();

  // 🚫 Don't show this NavBar on /employee pages
  if (location.pathname.startsWith('/employee')) {
    return null;
  }

  //To be used with Weather Description
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());
  

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

  const fetchWeather = async () => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Bryan&units=imperial&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
  
      const data = await response.json();
      setWeather(data);
      setWeatherError(false); // Reset error state if successful
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError(true); // Set error state
    }
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

    fetchWeather();
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
        <Link to="/cart">Cart {cartItems.length > 0 && `(${cartItems.length})`}</Link>
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
            🌡 {Math.round(weather.main?.temp)}°F°F |{' '}
            {capitalizeWords(weather.weather?.[0]?.description)}
          </span>
        ) : (
          <span>Loading weather...</span>
        )}
      </div>
    </nav>
  );
}

export default NavBar;