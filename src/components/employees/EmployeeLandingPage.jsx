import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeLandingPage.css';

const EmployeeLandingPage = () => {
  const navigate = useNavigate();

    const handleHomeClick = (e) => {
    e.preventDefault(); // Prevent SPA navigation
    window.location.href = '/'; // ✅ Full reload
  };

  return (
    <div className="landing-page">
      <h1>Welcome, Employee</h1>
      <div className="landing-buttons">
        <button onClick={() => navigate('/employee/menu')}>Go to Menu</button>
        <button onClick={() => navigate('/employee/cart')}>View Cart</button>
        <button onClick={handleHomeClick}>Back to Home</button>
      </div>
    </div>
  );
};

export default EmployeeLandingPage;
