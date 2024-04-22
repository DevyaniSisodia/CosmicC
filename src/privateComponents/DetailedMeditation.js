import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DetailedMeditation.css';
import {arrayUnion} from 'firebase/firestore';
import { db, doc, getDoc, updateDoc, collection, query, where, getDocs } from '../firebase';
import { auth } from '../firebase';

const DetailedMeditation = () => {
  const { id } = useParams();
  const [meditation, setMeditation] = useState(null);
  const [progressSaved, setProgressSaved] = useState(false);

  useEffect(() => {
    const fetchMeditation = async () => {
      try {
        const meditationDoc = doc(db, 'meditations', id);
        const meditationSnapshot = await getDoc(meditationDoc);
        if (meditationSnapshot.exists()) {
          setMeditation({ id: meditationSnapshot.id, ...meditationSnapshot.data() });
        } else {
          console.error('Meditation not found');
        }
      } catch (error) {
        console.error('Error fetching meditation:', error);
      }
    };

    fetchMeditation();
  }, [id]);

  const handleMarkAsFinished = async () => {
    try {
      const durationString = meditation.duration;
      const colonIndex = durationString.indexOf(':');
      const durationInSeconds = parseInt(durationString.substring(0, colonIndex), 10);
      
      // Get user's stats document
      const statsQuery = query(collection(db, 'stats'), where('UID', '==', auth.currentUser.uid));
      const statsSnapshot = await getDocs(statsQuery);
  
      if (!statsSnapshot.empty) {
        const statsDoc = statsSnapshot.docs[0];
        const currentMinutes = statsDoc.data().Minutes || 0;
        const currentSessions = statsDoc.data().Sessions || 0;
        let streak = statsDoc.data().Streak || 0;
        const lastStreakUpdateDate = statsDoc.data().lastStreakUpdateDate || null;
  
        // Update last streak update date
        await updateDoc(statsDoc.ref, { lastStreakUpdateDate: getCurrentDate() });
        
        // Update total minutes
        await updateDoc(statsDoc.ref, { Minutes: currentMinutes + durationInSeconds });
        
        // Update total sessions
        await updateDoc(statsDoc.ref, { Sessions: currentSessions + 1 });
  
        setProgressSaved(true);
  
        setTimeout(() => {
          setProgressSaved(false);
        }, 5000);
  
        // Update map data
        const mapData = statsDoc.data().map || {};
        const today = getCurrentDate();
        mapData[today] = (mapData[today] || 0) + 1;
        await updateDoc(statsDoc.ref, { map: mapData });
  
        // Update streak if necessary
        if (!isSameDate(lastStreakUpdateDate)) {
          streak++;
          await updateDoc(statsDoc.ref, { Streak: streak });
        } else {
          console.log('Streak not updated on the same day.');
        }
  
        // Add meditation ID to list array in stats document
        const statsDocRef = doc(db, 'stats', statsDoc.id);
        await updateDoc(statsDocRef, { list: arrayUnion(meditation.id) });
  
        // Add user's UID to views array in meditation document
        const meditationDocRef = doc(db, 'meditations', meditation.id);
        await updateDoc(meditationDocRef, { views: arrayUnion(auth.currentUser.uid) });
        await updateDoc(meditationDocRef, { totalViews: meditation.totalViews + 1 });
      } else {
        console.error('Stats document not found for the user');
      }
    } catch (error) {
      console.error('Error updating meditational progress:', error);
    }
  };
  

  if (!meditation) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="meditation-card">
        <div className="left-section">
          <h2>{meditation.name}</h2>
          <p>Description: {meditation.description}</p>
          <p>Duration: {meditation.duration}</p>
          <p>Tag: {meditation.tag}</p>
          <audio controls>
            <source src={meditation.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
          <button className='mark-as-complete-button' onClick={handleMarkAsFinished}>
            Mark as finished
          </button>
          {progressSaved && <p>Meditational Progress Saved!</p>}
        </div>
        <div className="right-section">
          <img src={meditation.imageUrl} alt="Meditation" />
        </div>
      </div>
    </div>
  );
};

const isSameDate = (date) => {
  const currentDate = getCurrentDate();
  return date === currentDate;
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default DetailedMeditation;