import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import { translateText } from '../utils/translate';

function NavBar({ userName, setUserName }) {
  const [weather, setWeather] = useState(null); // State to store weather data
  const [weatherError, setWeatherError] = useState(false); // State to track errors
  const [language, setLanguage] = useState('es'); // Default target language (Spanish)
  const [translatedWeather, setTranslatedWeather] = useState(''); // Translated weather description

  const handleLogout = () => {
    setUserName(null); // Clear the user's name to log out
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Bryan&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather(data);

        // Translate the weather description
        const translated = await translateText(data.weather[0].description, language);
        setTranslatedWeather(translated || data.weather[0].description);

        setWeatherError(false); // Reset error state if successful
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherError(true); // Set error state
      }
    };

    fetchWeather();
  }, [language]); // Re-fetch weather when language changes

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

      {/* Weather information */}
      <div className="weather-info">
        {weatherError ? (
          <span>Error loading weather</span>
        ) : weather ? (
          <span>
            🌡 {Math.round(9 / 5 * (weather.main?.temp) + 32)}°F | {translatedWeather}
          </span>
        ) : (
          <span>Loading weather...</span>
        )}
      </div>

      {/* Language selector */}
      <div className="language-selector">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>
    </nav>
  );
}

export default NavBar;