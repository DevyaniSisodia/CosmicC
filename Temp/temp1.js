import React, { useState } from 'react';
import axios from 'axios';

const AddMeditation = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleAudioFileUpload = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleImageFileUpload = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const audioFormData = new FormData();
      audioFormData.append('audio', audioFile);

      const audioResponse = await axios.post('http://localhost:5000/api/upload-audio', audioFormData);
      setAudioUrl(audioResponse.data);

      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const imageResponse = await axios.post('http://localhost:5000/api/upload-image', imageFormData);
      setImageUrl(imageResponse.data);

      console.log('Files uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div>
      <h2>Add New Meditation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Audio File:
          <input type="file" accept="audio/*" onChange={handleAudioFileUpload} />
        </label>
        <label>
          Image File:
          <input type="file" accept="image/*" onChange={handleImageFileUpload} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {audioUrl && <p>{audioUrl}</p>}
      {imageUrl && <p>{imageUrl}</p>}
    </div>
  );
};

export default AddMeditation;
