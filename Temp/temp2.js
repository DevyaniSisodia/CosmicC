const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5000;

app.use(cors());

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: 'AKIAXYKJVB4MMBQZXTOK',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint for uploading audio files
app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;

    const params = {
      Bucket: 'cosmic-calm',
      Key: `Audio/${uuidv4()}.mp3`,
      Body: audioFile.buffer,
      ContentType: 'audio/mpeg',
    };

    await s3.upload(params).promise();

    res.status(200).send('Audio file uploaded successfully!');
  } catch (error) {
    console.error('Error uploading audio file:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint for uploading image files
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;

    const params = {
      Bucket: 'cosmic-calm',
      Key: `Images/${uuidv4()}.jpg`,
      Body: imageFile.buffer,
      ContentType: 'image/jpeg',
    };

    await s3.upload(params).promise();

    res.status(200).send('Image file uploaded successfully!');
  } catch (error) {
    console.error('Error uploading image file:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
