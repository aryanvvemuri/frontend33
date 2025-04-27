import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import CustomizePage from './components/CustomizePage';
import CartPage from './components/CartPage';
import NavBar from './components/NavBar';
import GoogleLoginComponent from './components/GoogleLogin';
import Manager from './components/Manager';
import LandingPage from './components/LandingPage';

function App() {
  const [userName, setUserName] = useState(null); // State to store the logged-in user's name
  const [userEmail, setUserEmail] = useState(null); // State to store the logged-in user's email

  // List of approved manager emails
  const approvedManagers = [
    'tylerr13@tamu.edu',
    'ranchhodshiv@tamu.edu',
    'avv123@tamu.edu',
    'harsh_jan@tamu.edu',
  ];

  const isManager = approvedManagers.includes(userEmail); // Check if the email is in the list

  return (
    <>
      <NavBar
        userName={userName}
        setUserName={setUserName}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu/:categoryId" element={<MenuPage />} />
        <Route path="/customize/:id" element={<CustomizePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/manager"
          element={isManager ? <Manager /> : <LandingPage />}
        />
        <Route
          path="/employee"
          element={isManager ? <div>Employee Screen</div> : <LandingPage />}
        />
        <Route
          path="/login"
          element={<GoogleLoginComponent setUserName={setUserName} setUserEmail={setUserEmail} />}
        />
      </Routes>
    </>
  );
}

export default App;