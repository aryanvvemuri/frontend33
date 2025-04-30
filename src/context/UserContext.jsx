import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state
  const [isManager, setIsManager] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (userName) {
        try {
          const managerRes = await axios.get(
            `https://leboba.onrender.com/api/employees/isManager?name=${encodeURIComponent(userName)}`
          );
          setIsManager(managerRes.data.isManager);

          const employeeRes = await axios.get(
            `https://leboba.onrender.com/api/employees/isEmployee?name=${encodeURIComponent(userName)}`
          );
          setIsEmployee(employeeRes.data.isEmployee);
        } catch (err) {
          console.error('Error checking user status:', err);
        }
      }
    };

    checkUserStatus();
  }, [userName]);

  return (
    <UserContext.Provider value={{ userName, setUserName, userId, setUserId, isManager, isEmployee }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);