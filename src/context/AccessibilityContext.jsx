import React, { createContext, useContext, useState } from 'react';

// Create the context
const AccessibilityContext = createContext();

// Create a provider component
export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [highContrast, setHighContrast] = useState(false); // Default: normal mode

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Create a custom hook to access the context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
