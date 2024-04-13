import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

import 'react-calendar-heatmap/dist/styles.css';
import './Heatmap.css';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const statsCollection = collection(db, 'stats');
        const statsQuery = query(statsCollection, where('UID', '==', auth.currentUser.uid));
        const statsSnapshot = await getDocs(statsQuery);

        if (!statsSnapshot.empty) {
          const statsData = statsSnapshot.docs[0].data();
          const heatmapData = prepareHeatmapData(statsData);
          setHeatmapData(heatmapData);
        }
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      }
    };

    fetchHeatmapData();
  }, []);

  const prepareHeatmapData = (statsData) => {
    const today = getCurrentDate();
    const startDate = getPastDate(365);
    const dateRange = generateDateRange(startDate, today);

    const heatmapData = dateRange.map(date => {
      const sessions = statsData.map && statsData.map[date] ? statsData.map[date] : 0;
      return { date, count: sessions };
    });

    return heatmapData;
  };

  const generateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];

    while (start <= end) {
      dateRange.push(start.toISOString().slice(0, 10));
      start.setDate(start.getDate() + 1);
    }

    return dateRange;
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getPastDate = (daysAgo) => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - daysAgo);
    const year = pastDate.getFullYear();
    const month = String(pastDate.getMonth() + 1).padStart(2, '0');
    const day = String(pastDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className='heatmap-container'>
      <CalendarHeatmap
        startDate={getPastDate(365)}
        endDate={getCurrentDate()}
        values={heatmapData}
        classForValue={value => {
          if (!value) {
            return 'color-empty';
          }

          const count = value.count;
          if (count < 1) {
            return 'color-none';
          } 
          else if (count < 5) {
            return 'color-scale-1'
          }
          else if (count < 10) {
            return 'color-scale-2'
          }
          else {
            return 'color-scale-3'
          }
        }}
        tooltipDataAttrs={value => {
          return {
            'data-tip': `${value.date} has count: ${value.count}`,
          };
        }}
        showWeekdayLabels={true}
        onClick={value => alert(`Clicked on ${value.date} with count: ${value.count}`)}
      />
      <ReactTooltip />
    </div>
  );
};

export default Heatmap;
