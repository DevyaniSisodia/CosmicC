import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import PrivateNavigation from './PrivateNavigation';
import './PrivateDashboard.css';
import { Link } from 'react-router-dom';

const PrivateDashboard = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        updateGreeting();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const updateGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="private-dashboard">
      <h2>{`${greeting}, ${user.displayName || user.email}!`}</h2>
      <div className="button-list">
        <Link to="/stats"><button> My Stats </button></Link>
        <Link to='/personalized'><button>Personalized Meditations</button></Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default PrivateDashboard;
