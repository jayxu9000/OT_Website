import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router
import { useAuth } from '../components/AuthContext';
import LoadingSpinner from '../components/LoadSpinner'; // Ensure this path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State for tracking loading status
  const navigate = useNavigate();
  const { login } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        navigate('/'); // Navigate to the homepage or dashboard after login
      } else {
        setErrorMessage(data.message || 'An error occurred during login.');
      }
    } catch (error) {
      console.error("There was an error with the login request:", error);
      setErrorMessage('An error occurred during login.');
    }

    setIsLoading(false); // Stop loading
  };

  return (
    <div className='login'>
      <h2>Login:</h2>
      <form className='loginForm' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isLoading? <LoadingSpinner /> : <button type="submit" disabled={isLoading}>Login</button>}
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Login;
