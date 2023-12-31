import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

function SignUp() {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [lineNumber, setLineNumber] = useState(null)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [linkedIn, setlinkedIn] = useState('');
  const [verified, setVerified] = useState(false)
  const [admin, setAdmin] = useState(false)
  const apiUrl = process.env.REACT_APP_API_URL;

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      const response = await fetch('https://ec2-18-117-157-65.us-east-2.compute.amazonaws.com:443/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, lineNumber, email, password, image, linkedIn, verified, admin }),
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

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!/^[a-zA-Z0-9._%+-]+@buffalo\.edu$/.test(value)) {
        setErrorMessage('Please enter a University at Buffalo email address.');
    } else {
        setErrorMessage('');
    }
};

  return (
    <div className='signUp'>
      <h3>Sign Up</h3>
      <form className='signUpForm' onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Line Number"
          value={lineNumber}
          onChange={(e) => setLineNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
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
