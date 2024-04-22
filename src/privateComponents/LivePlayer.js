import React, { useEffect } from 'react';

const DetailedLive = ({ topic }) => {
  useEffect(() => {
    const domain = '8x8.vc';
    const options = {
      roomName: topic,
      parentNode: document.querySelector('#jitsi-container'),
    };

    const api = new window.JitsiMeetExternalAPI(domain, options);

    return () => {
      api.dispose();
    };
  }, [topic]);

  return <div id="jitsi-container" style={{ height: '100vh' }}></div>;
};

export default DetailedLive;
