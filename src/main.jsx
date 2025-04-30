import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './components/CartContext'; 
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/UserContext'; // Import UserProvider


const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <CartProvider>
      <UserProvider> {/* Wrap the App with UserProvider */}
        <App />
      </UserProvider>
    </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
