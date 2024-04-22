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
import Community from './privateComponents/Community';
import ViewPost from './privateComponents/viewPost';
import AddPost from './privateComponents/addPost'; 
import MyPosts from './privateComponents/myPosts'; 
import EditPost from './privateComponents/editPost';
import LiveClasses from './privateComponents/LiveClasses';
import History from './privateComponents/history';

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
          element={user ? <PrivateDashboard /> : <Navigate to="/home" />}
        />
        <Route
          path="/analysis"
          element={user ? <PrivateAnalysis /> : <Navigate to="/analysis" />}
        />
        <Route path="/meditate/:id" element={<DetailedMeditation />} />
        <Route path="/view-post/:postId" element={<ViewPost />} />
        <Route
          path="/stats"
          element={user ? <StatsPage /> : <Navigate to="/stats" />}
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
          path="/community"
          element={user ? <Community /> : <Navigate to="/community" />}
        />
        <Route
          path="/add-post"
          element={user ? <AddPost /> : <Navigate to="/add-post" />}
        />           
        <Route
          path="/my-posts"
          element={user ? <MyPosts /> : <Navigate to="/my-posts" />}
        />      
        <Route
          path="/edit-post/:postId"
          element={user ? <EditPost /> : <Navigate to="/edit-post/:postId" />}
        />  
        <Route
          path="/schedule"
          element={user ? <LiveClasses /> : <Navigate to="/schedule" />}
        /> 
        <Route
          path="/history"
          element={user ? <History /> : <Navigate to="/history" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
