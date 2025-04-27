import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to LeBoba</h1>
      <div className="landing-buttons">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/menu/1')}>Continue as Customer</button>
      </div>
    </div>
  );
};

export default LandingPage;