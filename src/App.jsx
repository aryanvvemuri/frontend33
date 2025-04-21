import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import CustomizePage from './components/CustomizePage';
import CartPage from './components/CartPage';
import NavBar from './components/NavBar';

import GoogleLoginComponent from './components/GoogleLogin';

import Manager from './components/Manager';



function App() {
  const [userName, setUserName] = useState(null); // State to store the logged-in user's name

  return (
    <>
      <NavBar userName={userName} setUserName={setUserName} /> {/* Pass userName and setUserName */}
      <Routes>
        <Route path="/" element={<Navigate to="/menu/1" />} />
        <Route path="/menu/:categoryId" element={<MenuPage />} />
        <Route path="/customize/:id" element={<CustomizePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<GoogleLoginComponent setUserName={setUserName} />} />
        <Route path="/manager" element={<Manager />} />


      </Routes>
    </>
  );
}

export default App;