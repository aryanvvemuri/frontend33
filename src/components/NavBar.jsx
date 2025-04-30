import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { useUser } from '../context/UserContext';
import './NavBar.css';

function NavBar() {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { userName, isManager, isEmployee, setUserName, setIsManager, setIsEmployee } = useUser();

  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleLogout = () => {
    setUserName(null);
    setIsManager(false);
    setIsEmployee(false);
    navigate('/');
  };

  const fetchWeather = async () => {
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Bryan&units=imperial&appid=${apiKey}`
      );
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const data = await response.json();
      setWeather(data);
      setWeatherError(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError(true);
    }
  };

  useEffect(() => {
    if (location.pathname.startsWith('/employee')) return; // Don't load on /employee

    if (!document.querySelector('script[src*="translate.google.com"]')) {
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
    }

    fetchWeather();
  }, [location.pathname]);

  const hideNavContent = location.pathname.startsWith('/employee');

  return (
    <nav className="nav-bar">
      {/* Only render Translate when not on /employee */}
      {!hideNavContent && (
        <div id="google_translate_element" className="translate-dropdown"></div>
      )}

      {!hideNavContent && (
        <>
          <div className="nav-links">
            {userName && <span className="welcome-name">Welcome, {userName}!</span>}
          </div>

          <div className="nav-links">
            <Link to="/menu/1">Menu</Link>
            <Link to="/cart">Cart {cartItems.length > 0 && `(${cartItems.length})`}</Link>
            {isManager && (
              <>
                <Link to="/manager">Manager</Link>
                <Link to="/employee">Employee</Link>
              </>
            )}
            {!isManager && isEmployee && (
              <Link to="/employee">Employee</Link>
            )}
            {userName ? (
              <button onClick={handleLogout} className="logout-link">Logout</button>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>

          <div className="weather-info">
            {weatherError ? (
              <span>Error loading weather</span>
            ) : weather ? (
              <span>
                🌡 {Math.round(weather.main?.temp)}°F |{' '}
                {capitalizeWords(weather.weather?.[0]?.description)}
              </span>
            ) : (
              <span>Loading weather...</span>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default NavBar;
