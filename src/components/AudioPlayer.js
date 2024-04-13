import React, { useState, useEffect } from 'react';

const AudioPlayer = ({ audioId }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    const fetchAudioUrl = async () => {
      try {
        const response = await fetch(`http://localhost:8000/audio/${audioId}/`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setAudioUrl(URL.createObjectURL(await response.blob()));
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudioUrl();
  }, [audioId]);

  return (
    <div>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;
