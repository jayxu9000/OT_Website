import React from 'react';
import { useState } from 'react';

function SignUp() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // User data to be sent to the backend
    const userData = {
      username: username, // Assuming "name" is the field you want in the backend
      password: password // Assuming you'll handle and store passwords securely
    };

    try {
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json()

      if (response.status !== 201) {
        setErrorMessage(data.message)
      } else {
        setErrorMessage('')
      }
    } catch (error) {
      console.error("There was an error with the POST request:", error);
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
