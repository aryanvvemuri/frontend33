import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ userName, setUserName }) {
  const [weather, setWeather] = useState(null); // State to store weather data
  const [weatherError, setWeatherError] = useState(false); // State to track errors

  const handleLogout = () => {
    setUserName(null); // Clear the user's name to log out
  };

  // Function to capitalize the first letter of every word
function capitalizeWords(str) {
  return str
    .split(' ') // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words back into a single string
}

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
        setWeatherError(false); // Reset error state if successful
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setWeatherError(true); // Set error state
      }
    };

    fetchWeather();
  }, []);

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
            🌡 {Math.round(9 / 5 * (weather.main?.temp) + 32)}°F |{' '}
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