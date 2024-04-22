import React from 'react';
import { DailyIframe } from '@daily-co/react';

const DailyMeeting = () => {
  return (
    <div>
      <DailyIframe
        url="https://your-subdomain.daily.co/your-room-url"
        style={{ width: '100%', height: '500px', border: 'none' }}
      />
    </div>
  );
};

export default DailyMeeting;
