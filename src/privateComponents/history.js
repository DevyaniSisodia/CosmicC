import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Adjust the path to your firebase.js file
import './History.css';
import { Link } from 'react-router-dom';

const StatsPage = () => {
  const [streak, setStreak] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [points, setPoints] = useState(0);
  const [pastMeditations, setPastMeditations] = useState([]);

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

          // Fetch past meditations using the list stored for the current user
          const pastMeditationIds = statsData.list || [];
          const pastMeditationsData = await Promise.all(pastMeditationIds.map(async (id) => {
            const meditationDoc = doc(db, 'meditations', id);
            const meditationSnapshot = await getDoc(meditationDoc);
            return { id: meditationSnapshot.id, ...meditationSnapshot.data() };
          }));
          setPastMeditations(pastMeditationsData);
        }
      } catch (error) {
        console.error('Error fetching stats data:', error);
      }
    };

    fetchStatsData();
  }, []); // Fetch the stats data only once when the component mounts

  return (
    <div className='past'>
      <div className="past-container">
        <h2>Past Meditations</h2>
        <ul>

          {pastMeditations.map((meditation) => (
             <Link key={meditation.id} to={`/meditate/${meditation.id}`}>
             <div className="past-card">
            <li key={meditation.id}>
              <p>{meditation.name}</p>
            </li>
            </div>
            </Link>
          ))}
        </ul>
    </div>
    </div>
  );
};

export default StatsPage;
