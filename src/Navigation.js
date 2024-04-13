// Navigation.js
import './Navigation.css'
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar-container">
      <div className="navbar-background"></div>
      <div className="navbar-overlay"></div>
      <ul className="navbar">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/mindfulness">Mindfulness</Link></li>
        <li><Link to="/sleep">Sleep</Link></li>
        <li><Link to="/stress">Stress</Link></li>
        <li className="signup-button"><Link to="/signup">Sign Up. It's FREE</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
