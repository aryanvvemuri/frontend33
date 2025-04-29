import React, { createContext, useContext, useState } from 'react';

const AllergenContext = createContext();

export function AllergenProvider({ children }) {
  const [userAllergens, setUserAllergens] = useState([]);

  return (
    <AllergenContext.Provider value={{ userAllergens, setUserAllergens }}>
      {children}
    </AllergenContext.Provider>
  );
}

export const useAllergens = () => useContext(AllergenContext);