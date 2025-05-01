import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useAccessibility } from '../context/AccessibilityContext'; // ✅ Import context

const LandingPage = () => {
  const navigate = useNavigate();
  const { highContrast, fontSize } = useAccessibility(); // ✅ Use accessibility settings

  return (
    <div
      className={`landing-page ${highContrast ? 'high-contrast' : ''}`} // ✅ Add class
      style={{ fontSize: `${fontSize}px` }} // ✅ Apply font size
    >
      {/* Main landing content */}
      <div className="landing-content" style={{ position: 'relative', zIndex: 1 }}>
        <h1>Welcome to LeBoba</h1>
        <div className="landing-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/menu/1')}>Continue as Customer</button>
        </div>
      </div>

      {/* Boba cup with pearls */}
      <div className="boba-cup">
        <div className="boba-rim" />
        <div className="boba-pearls-container">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="boba-pearl"
              style={{
                left: `${Math.random() * 80 + 10}%`,
                animationDuration: `${4 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;