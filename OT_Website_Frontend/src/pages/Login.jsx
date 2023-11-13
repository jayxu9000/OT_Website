import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router
import { useAuth } from '../components/AuthContext';

function Login() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [image, setImage] = useState(null);
  const [linkedIn, setlinkedIn] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    try {
      const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Necessary to include the session cookie in requests
        body: JSON.stringify({ name, username, password, image, linkedIn }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data)
        navigate('/'); // Navigate to the homepage or dashboard after login
      } else {
        // Handle errors, e.g., wrong credentials, user doesn't exist, etc.
        setErrorMessage(data.message || 'An error occurred during login.');
      }
    } catch (error) {
      console.error("There was an error with the login request:", error);
      setErrorMessage('An error occurred during login.');
    }
  };

  return (
    <div className='login'>
      <h3>Login:</h3>
      <form className='loginForm' onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
