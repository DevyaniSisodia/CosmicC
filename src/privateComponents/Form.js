import React, { useState } from 'react';
import { doc, setDoc, db, auth } from '../firebase'; // Import necessary Firebase dependencies
import './SliderForm.css';
import { Navigate } from 'react-router-dom';

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

const options = [
  ['Improve Sleep', 'Reduce Stress', 'Enhance Mindfulness'],
  ['5-10 minutes', '15-20 minutes', '25-30 minutes', 'More than 30 minutes'],
  ['Morning', 'Afternoon', 'Evening', 'Anytime'],
  ['Quiet and Dark', 'Calm Nature Sounds', 'Soft Ambient Music', 'Any Comfortable Setting'],
  ['1-3', '4-6', '7-8', '9-10'],
  ['Falling Asleep Faster', 'Deeper Sleep', 'Overcoming Insomnia', 'Relaxation from work stress'],
  ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  ['Stress Reduction', 'Improved Focus', 'Emotional Well-being', 'Overall Mind-Body Connection'],
];

const SliderForm = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answersArray, setAnswersArray] = useState(Array(questions.length).fill(''));
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleOptionSelect = (option) => {
    const updatedAnswersArray = [...answersArray];
    updatedAnswersArray[currentQuestion] = option;
    setAnswersArray(updatedAnswersArray);
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    if (answersArray[currentQuestion] !== '') {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // If on the last question, submit the form
        submitForm();
      }
    }
  };

  const submitForm = async () => {
    const uid = auth.currentUser.uid; // Replace with the actual UID
    const formDocRef = doc(db, 'form', uid);

    try {
      // Set the answersArray and isFormSubmitted in the 'form' collection
      await setDoc(formDocRef, {
        answers: answersArray,
        isFormSubmitted: true,
      });

      console.log('Form collection updated with selected options:', answersArray);

      // Set the form submission flag
      setIsFormSubmitted(true);
    } catch (error) {
      console.error('Error updating form collection:', error.code, error.message);
    }
  };

  return (
    <div className="slider-form">
      {isFormSubmitted ? (
        <Navigate to="/personalized-list" />
      ) : (
        <>
          <div className="card">
            <h1>{questions[currentQuestion]}</h1>
            <div className="options">
              {options[currentQuestion].map((option) => (
                <button
                  key={option}
                  className={answersArray[currentQuestion] === option ? 'selected' : ''}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isFormSubmitted} // Disable options after form submission
                >
                  {answersArray[currentQuestion] === option ? '✅ ' : ''}{option}
                </button>
              ))}
            </div>
          </div>
          <div className="navigation-buttons">
            <button onClick={handlePrevQuestion} disabled={currentQuestion === 0 || isFormSubmitted}>
              Previous
            </button>
            <button onClick={handleNextQuestion} disabled={answersArray[currentQuestion] === '' || isFormSubmitted}>
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SliderForm;
