import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import coatOfArms from '../assets/navbarPhotos/coatOfArms.png';

function Navbar() {
  const { authData, logout } = useAuth();

  return (
    <nav className="navbar">
      <img src={coatOfArms} alt='coatOfArms' />
      <div className='left'>
        <Link to="/">Home</Link>
        {/* <Link to="/rush">Rush</Link> */}
        <Link to="/brotherhood">Brotherhood</Link>
      </div>
      <div className='right'>
        {authData ? (
          <>
            <Link to="/settings">{authData.firstName}</Link>
            <Link to="/" onClick={logout}>Logout</Link>
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
