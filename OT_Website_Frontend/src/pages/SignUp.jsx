import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        login(data);  // Call the login function from your auth context with the received data        
        navigate('/'); // Redirect the user to the home page or dashboard
      } else {
        setErrorMessage(data.message || 'Signup failed.');  // If the signup was not successful, display the error message from the backend
      }
    } catch (error) {
      console.error('There was an error with the signup request:', error); // If there was a problem with the fetch request itself, display a generic error message
      setErrorMessage('An error occurred during signup. Please try again later.');
    }
  };

  return (
    <div>
      Sign Up Page:
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default SignUp;
