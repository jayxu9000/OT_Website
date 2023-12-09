import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    // Check for auth data in local storage
    const storedAuthData = localStorage.getItem('authData');
    return storedAuthData ? JSON.parse(storedAuthData) : null;
  });

  const login = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data)); // Store auth data in local storage
  };

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem('authData'); // Remove auth data from local storage
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
