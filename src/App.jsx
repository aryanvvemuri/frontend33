import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import MenuPage from './components/MenuPage';
import CustomizePage from './components/CustomizePage';
import CartPage from './components/CartPage';
import NavBar from './components/NavBar';
import GoogleLoginComponent from './components/GoogleLogin';
import Manager from './components/Manager';
import LandingPage from './components/LandingPage';
import EmployeeMenu from './components/employees/EmployeeMenu';
import EmployeeCartPage from './components/employees/EmployeeCartPage';
import EmployeeNavBar from './components/employees/EmployeeNavBar';
import EmployeeLandingPage from './components/employees/EmployeeLandingPage';
import EmployeeCustomizePage from './components/employees/EmployeeCustomizePage';

function App() {
  const [userName, setUserName] = useState(null); // State to store the logged-in user's name
  const [userEmail, setUserEmail] = useState(null); // State to store the logged-in user's email

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.querySelector('script[src*="translate.google.com"]')) {
        return;
      }
      
      const script = document.createElement('script');
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      };
    };

    addGoogleTranslateScript();
  }, []);

  // List of approved manager emails
  const approvedManagers = [
    'tylerr13@tamu.edu',
    'ranchhodshiv@tamu.edu',
    'avv123@tamu.edu',
    'harsh_jan@tamu.edu',
  ];

  // Dynamically check if the user is a manager
  const isManager = useMemo(() => {
    return userEmail ? approvedManagers.includes(userEmail.toLowerCase()) : false;
  }, [userEmail]);

  console.log('User Email:', userEmail);

  return (
    <>
      {/* <div id="google_translate_element" style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 1000 }}></div> */}
      
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
          path="/login"
          element={<GoogleLoginComponent setUserName={setUserName} setUserEmail={setUserEmail} />}
        />
        
        <Route path="/employee/menu" element={<EmployeeMenu />} />
        <Route path="/employee/cart" element={<EmployeeCartPage />} />
        <Route path="/employee" element={<EmployeeLandingPage />} />
        
        <Route path="/employee/customize/:id" element={<EmployeeCustomizePage />} />
      </Routes>
    </>
  );
}

export default App;
