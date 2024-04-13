import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Adjust the path to your firebase.js file
import './StatsPage.css';
import Heatmap from './Heatmap';


const StatsPage = () => {
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        // Fetch user-specific stats data from Firestore using UID
        const statsCollection = collection(db, 'stats');
        const statsQuery = query(statsCollection, where('UID', '==', auth.currentUser.uid));
        const statsSnapshot = await getDocs(statsQuery);

        if (!statsSnapshot.empty) {
          const statsData = statsSnapshot.docs[0].data();
          setStreak(statsData.Streak || 0);
          setSessions(statsData.Sessions || 0);
          setMinutes(statsData.Minutes || 0);
          // Adjust X and Y based on your desired weights
          const X = 0.5; // Weight for Minutes
          const Y = 2;   // Weight for Sessions
          const calculatedPoints = (statsData.Minutes || 0) * X + (statsData.Sessions || 0) * Y;
          setPoints(calculatedPoints);
        }
      } catch (error) {
        console.error('Error fetching stats data:', error);
      }
    };

    fetchStatsData();
  }, []); // Fetch the stats data only once when the component mounts

  return (
    <div className='stats'>
    <div className="stats-container">
      <div className="stats-card">
        <div className="stats-content">
          <p>Cosmic Streak<br/><br/>{streak}</p>
          <p>Cosmic Sessions<br/><br/>{sessions}</p>
          <p>Cosmic Minutes<br/><br/>{minutes}</p>
        </div>
      </div>
      </div>
      <div className='heatmap'><Heatmap /></div>
    </div>
    
  );
};

export default StatsPage;
