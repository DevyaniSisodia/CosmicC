// PrivateNavigation.js
import { auth } from '../firebase';
import React from 'react';
import { Link } from 'react-router-dom';
import './PrivateNavigation.css';

const handleLogout = () => {
  auth.signOut();
};

const PrivateNavigation = () => {
  return (
    <nav className="private-nav">
      <ul className="private-nav-list">
        <li className="private-nav-item">
          <Link to="/home">Profile</Link>
        </li>
        <li className="private-nav-item">
          <Link to="/analysis">Meditate</Link>
        </li>
        <li className="private-nav-item">
          <Link to="https://www.youtube.com/watch?v=N4nX_rTwKx4">Cosmic Chat</Link>
        </li>
        <li className="private-nav-item">
          <Link to="/personalized">Personalized Meditations</Link>
        </li>
        <li className="private-nav-item">
          <Link to="/community">Community</Link>
        </li>
      </ul>
    </nav>
  );
};

export default PrivateNavigation;
