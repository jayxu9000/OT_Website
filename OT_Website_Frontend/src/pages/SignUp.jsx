import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // User data to be sent to the backend
    const userData = {
      username: username,
      password: password
    };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // Expect to receive JSON back
        },
        credentials: 'include', // Necessary to include the session cookie in requests
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Reset any error messages
        setErrorMessage('');
        // Redirect user to their dashboard or another appropriate page
        navigate('/'); // Change '/dashboard' to the path you want to redirect to after signup
      } else {
        // Display error message from the server, if any
        setErrorMessage(data.message || 'An error occurred during signup.');
      }
    } catch (error) {
      console.error("There was an error with the POST request:", error);
      setErrorMessage('An error occurred during signup.');
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
