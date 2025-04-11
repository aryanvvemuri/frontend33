import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import CustomizePage from './components/CustomizePage';
import CartPage from './components/CartPage';
import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        {/* Default route goes to menu directly */}
        <Route path="/" element={<Navigate to="/menu/1" />} />

        <Route path="/menu/:categoryId" element={<MenuPage />} />
        <Route path="/customize/:id" element={<CustomizePage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;
