// SignUp.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import { auth, googleAuthProvider } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc, collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const SignUp = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false); // Add flag for sign-up success
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { displayName, email, password } = formData;

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name (optional)
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      // Access the UID of the newly created user
      const uid = userCredential.user.uid;

      // Add a document to Firestore in the 'stats' collection
      const statsDocRef = doc(db, 'stats', uid);
      await setDoc(statsDocRef, {
        UID: uid,
        Minutes: 0,
        Sessions: 0,
        Streak: 0,
        map: createMapData(),
      });

      // Add a document to Firestore in the 'form' collection
      const formDocRef = doc(db, 'form', uid);
      await setDoc(formDocRef, {
        ...createFormQuestionsData(),
        isFormSubmitted: false, // Set the flag for sign-up success in the form collection
      });

      // Set the sign-up success flag
      setIsSignUpSuccessful(true);

      // Clear form data after successful signup
      setFormData({
        displayName: '',
        email: '',
        password: '',
      });

      console.log('User signed up:', auth.currentUser);

      // Redirect to the dashboard page after successful signup
      navigate('/personalized');
    } catch (error) {
      setIsSignUpSuccessful(false); // Set the flag to false in case of any sign-up errors
      console.error('Error signing up:', error.code, error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      // Sign in with Google
      const userCredential = await auth.signInWithPopup(googleAuthProvider);

      console.log('User signed up with Google:', userCredential.user);
    } catch (error) {
      console.error('Error signing up with Google:', error.code, error.message);
    }
  };

  const createMapData = () => {
    const mapData = {};
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-31');

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = date.toISOString().split('T')[0];
      mapData[formattedDate] = 0;
    }

    return mapData;
  };

  const createFormQuestionsData = () => {
    const formQuestionsData = {};
    const questions = [
      'Which meditation goal is most important to you?',
      'How much time can you dedicate to meditation on a typical day?',
      'When do you prefer to meditate for stress reduction?',
      'Which environment suits your meditation preferences?',
      'What is your current stress level on a scale from 1 to 10?',
      'Which aspect of sleep improvement are you most interested in?',
      'How experienced are you in practicing mindfulness meditation?',
      'What is your primary motivation for practicing mindfulness?',
    ];

    questions.forEach((question) => {
      formQuestionsData[question] = '';
    });

    return formQuestionsData;
  };

  return (
    <div className='signup'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          name="displayName"
          placeholder="Display Name"
          value={formData.displayName}
          onChange={handleChange}
        />
        <br />
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
        <br />
        <button type="submit">Sign Up</button>
        <p>Already a member? <Link to="/signin">Sign in here</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
