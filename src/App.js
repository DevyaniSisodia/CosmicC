// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './components/Home';
import Mindfulness from './components/Mindfulness';
import Sleep from './components/Sleep';
import Stress from './components/Stress';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PrivateDashboard from './privateComponents/PrivateDashboard';
import PrivateAnalysis from './privateComponents/PrivateAnalysis';
import PrivateNavigation from './privateComponents/PrivateNavigation'; // Import PrivateNavigation
import DetailedMeditation from './privateComponents/DetailedMeditation'; // Import the new component
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import StatsPage from './privateComponents/StatsPage';
import Personalized from './privateComponents/Personalized';
import PersonalizedList from './privateComponents/PersonalizedList'
import StravaConnection from './privateComponents/StravaConnection'

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      {user ? <PrivateNavigation /> : <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mindfulness" element={<Mindfulness />} />
        <Route path="/sleep" element={<Sleep />} />
        <Route path="/stress" element={<Stress />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/home"
          element={user ? <PrivateDashboard /> : <Navigate to="/signup" />}
        />
        <Route
          path="/analysis"
          element={user ? <PrivateAnalysis /> : <Navigate to="/signup" />}
        />
        <Route path="/meditate/:id" element={<DetailedMeditation />} />
        <Route
          path="/stats"
          element={user ? <StatsPage /> : <Navigate to="/signup" />}
        />
        <Route
          path="/personalized"
          element={user ? <Personalized /> : <Navigate to="/personalized" />}
        />
        <Route
          path="/personalized-list"
          element={user ? <PersonalizedList /> : <Navigate to="/personalized" />}
        />
        <Route
          path="/strava"
          element={user ? <StravaConnection /> : <Navigate to="/personalized" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
