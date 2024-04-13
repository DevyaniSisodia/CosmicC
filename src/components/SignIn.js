// SignIn.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';
import { auth, googleAuthProvider, signInWithEmailAndPassword } from '../firebase';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Clear form data after successful sign in
      setFormData({
        email: '',
        password: '',
      });

      // Clear any previous error messages
      setErrorMessage('');

      console.log('User signed in successfully');

      // Save user information to localStorage
      localStorage.setItem('user', JSON.stringify(userCredential.user));

      // Redirect to the dashboard
      navigate('/home');
    } catch (error) {
      // Handle sign-in errors
      console.error('Error signing in:', error.message);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className='signin'>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <br />
        <button type="submit">Sign In</button>
        <p>Not a member? <Link to="/signup">Sign up here</Link></p>
      </form>
    </div>
  );
};

export default SignIn;
