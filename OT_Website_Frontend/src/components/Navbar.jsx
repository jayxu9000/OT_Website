import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import coatOfArms from '../assets/navbarPhotos/coatOfArms.png';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to log out the user
  const handleLogout = async () => {
    // Send a request to the logout endpoint
    const response = await fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include', // to include the cookie in the request
    });

    // If the logout was successful, update the state
    if (response.ok) {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // Function to check the current session
    const checkSession = async () => {
      const response = await fetch('http://localhost:5000/check-session', {
        credentials: 'include',
      });
      const data = await response.json();
      setIsLoggedIn(data.isLoggedIn);

      console.log(isLoggedIn)
    };

    checkSession();
  }, []);

  return (
    <nav className="navbar">
      <img src={coatOfArms} alt='coatOfArms' />
      <div className='left'>
        <Link to="/">Home</Link>
        <Link to="/rush">Rush</Link>
        <Link to="/brotherhood">Brotherhood</Link>
      </div>
      <div className='right'>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
