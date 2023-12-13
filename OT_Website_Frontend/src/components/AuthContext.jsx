import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  useEffect(() => {
    if (authData && authData._id) {
      fetchUserImage(authData._id);
    }
  }, []);

  const [authData, setAuthData] = useState(() => {
    // Check for auth data in local storage
    const storedAuthData = localStorage.getItem('authData');
    return storedAuthData ? JSON.parse(storedAuthData) : null;
  });

  const fetchUserImage = async (userId) => {
    try {
      const imageResponse = await fetch(`http://localhost:5000/users/Profile/image/${userId}`);
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setAuthData(prevData => ({ ...prevData, image: imageUrl }));
      }
    } catch (error) {
      console.error('Error fetching user image:', error);
    }
  };

  const login = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data)); // Store auth data in local storage
    fetchUserImage(data._id);
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
