// PrivateAnalysis.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, collection, doc, getDoc, auth } from '../firebase'; // Update the import statements
import './PrivateAnalysis.css';
import Form from './Form';
import PersonalizedList from './PersonalizedList'; // Import PersonalizedList component

const PrivateAnalysis = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const checkFormSubmission = async () => {
      const docRef = doc(db, 'form', auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const formData = docSnap.data();
        setIsFormSubmitted(formData.isFormSubmitted || false);
      }
    };

    checkFormSubmission();
  }, []);

  return (
    <div>
      {isFormSubmitted ? (
        <PersonalizedList />
      ) : (
        <Form />
      )}
    </div>
  );
};

export default PrivateAnalysis;
