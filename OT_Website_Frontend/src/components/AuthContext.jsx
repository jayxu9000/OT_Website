import React, { createContext, useState, useContext, useEffect } from 'react';
import blankProfile from '../assets/brotherhoodPhotos/blankProfile.jpg';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [authData, setAuthData] = useState(() => {
    // Check for auth data in local storage
    const storedAuthData = localStorage.getItem('authData');
    return storedAuthData ? JSON.parse(storedAuthData) : null;
  });

  const fetchUserImage = async (userId) => {
    try {
      const imageResponse = await fetch(`https://ec2-34-233-135-215.compute-1.amazonaws.com:443/users/Profile/image/${userId}`);
      let imageUrl;
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob();
        imageUrl = URL.createObjectURL(imageBlob);
      } else {
        imageUrl = blankProfile;
      }
      setAuthData(prevData => ({ ...prevData, image: imageUrl }));
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

  useEffect(() => {
    if (authData?._id) {
      fetchUserImage(authData._id);
    }
  }, [authData?._id]);

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
