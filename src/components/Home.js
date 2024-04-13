import React from 'react';
import './Home.css';
import {Link} from 'react-router-dom'

const Home = () => {
  return (
    <div className='home'>
      <h1>Cosmic Calm</h1>
      <p>Find inner peace among the stars. Guided meditations, soothing soundscapes, and calming narratives help you <br /> unwind, de-stress, and explore your inner world. Free to join.</p>
      <Link to="/signup"><button>Sign Up now. It's FREE</button></Link>
    </div>
  );
};

export default Home;
