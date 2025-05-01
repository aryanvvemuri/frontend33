import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { useUser } from '../context/UserContext';
import { useAccessibility } from '../context/AccessibilityContext'; // ✅ Import context
import './NavBar.css';

function NavBar() {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { userName, isManager, isEmployee, setUserName, setIsManager, setIsEmployee } = useUser();
  const { fontSize, highContrast, setFontSize, setHighContrast } = useAccessibility(); // ✅ Use values
 
  const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleLogout = () => {
    setUserName(null);
    setIsManager(false);
    setIsEmployee(false);
  
    // Clear local storage or session storage
    localStorage.removeItem('isManager');
    localStorage.removeItem('isEmployee');
    localStorage.removeItem('userName');
  
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
    if (location.pathname.startsWith('/employee')) return;

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
    <nav className={`nav-bar ${highContrast ? 'high-contrast' : ''}`}>
      {!hideNavContent && (
        <>
          <div id="google_translate_element" className="translate-dropdown"></div>

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

          {/* ✅ Accessibility controls */}
          <div className="accessibility-controls">
            <button onClick={() => setFontSize(prev => Math.min(prev + 2, 24))}>A+</button>
            <button onClick={() => setFontSize(prev => Math.max(prev - 2, 12))}>A−</button>
            <button onClick={() => setHighContrast(prev => !prev)}>
              {highContrast ? 'Normal Mode' : 'High Contrast'}
            </button>
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
