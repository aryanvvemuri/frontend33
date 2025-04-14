import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import CustomizePage from './components/CustomizePage';
import CartPage from './components/CartPage';
import NavBar from './components/NavBar';
import Manager from './components/Manager';


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
        <Route path="/manager" element={<Manager />} />

      </Routes>
    </>
  );
}

export default App;
