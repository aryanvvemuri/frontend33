import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeLandingPage.css';

const EmployeeLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome, Employee</h1>
      <div className="landing-buttons">
        <button onClick={() => navigate('/employee/menu')}>Go to Menu</button>
        <button onClick={() => navigate('/employee/cart')}>View Cart</button>
        <button onClick={() => navigate('/menu/1')}>Back to Home</button>
      </div>
    </div>
  );
};

export default EmployeeLandingPage;
