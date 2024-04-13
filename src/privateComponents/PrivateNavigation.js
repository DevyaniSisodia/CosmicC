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
          <Link to="/sleep">Sleep</Link>
        </li>
        <li className="private-nav-item">
          <Link to="/stress">Stress</Link>
        </li>
        <li className="private-nav-item">
          <Link to="/stress">Nature</Link>
        </li>
      </ul>
    </nav>
  );
};

export default PrivateNavigation;
