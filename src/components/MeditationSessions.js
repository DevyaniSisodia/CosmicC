// src/components/MeditationSessions.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MeditationSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/meditation-sessions/')
      .then(response => setSessions(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Meditation Sessions</h1>
      <ul>
        {sessions.map(session => (
          <li key={session.title}>
            {session.title} - <audio controls src={session.audio_file} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeditationSessions;
