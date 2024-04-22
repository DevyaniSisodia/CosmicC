import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import './LiveClasses.css';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const SchedulePage = () => {
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  useEffect(() => {
    const fetchUpcomingSchedules = async () => {
      try {
        const schedulesCollection = collection(db, 'schedule');
        const q = query(schedulesCollection, orderBy('startTime'));
        const querySnapshot = await getDocs(q);
        const schedulesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).filter(schedule => new Date() - schedule.startTime.toDate() < 100000000); // 15 minutes in milliseconds
        setUpcomingSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchUpcomingSchedules();
  }, []);

  const handleScheduleClick = (schedule) => {
    const timeDifference = schedule.startTime.toDate() - new Date();
    if (timeDifference > 900000) { // 15 minutes in milliseconds
      alert('This live session will start in more than 15 minutes.');
    } else {
      // Redirect to the detailed live page with the schedule's id
      return <Link to={`/schedule/${schedule.id}`} />;
    }
  };

  return (
    <div className="schedule-page">
      <h1>Upcoming Live Session</h1>
      <div className="schedule-cards">
        {upcomingSchedules.map((schedule, index) => (
        <Link key={index} to={`/schedule/${schedule.Topic}`} className="schedule-link">
          <div key={index} className="schedule-card" onClick={() => handleScheduleClick(schedule)}>
            <h2>Topic: {schedule.Topic}</h2>
            <p>Start Date: {formatDate(schedule.startTime.toDate())}</p>
            <p>Start Time: {formatTime(schedule.startTime.toDate())}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Function to format date
const formatDate = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

// Function to format time
const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return date.toLocaleTimeString(undefined, options);
};

export default SchedulePage;
