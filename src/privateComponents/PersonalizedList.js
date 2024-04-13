import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './PrivateAnalysis.css';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, query, getDocs } from 'firebase/firestore';

const PrivateAnalysis = () => {
  const [meditations, setMeditations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = auth.currentUser.uid;

        // Construct the document reference correctly
        const formsRef = doc(db, `form/${userId}`);
        const formSnapshot = await getDoc(formsRef);
        const formData = formSnapshot.data().answers;
        console.log(formData);

        // Fetch list of meditations from Firebase
        const meditationsCollection = collection(db, 'meditations');
        const meditationsSnapshot = await getDocs(meditationsCollection);
        const meditationData = meditationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMeditations(meditationData);

        // Send data to the backend for analysis
        const response = await axios.post('http://localhost:5000/api/recommendations', {
          answers: formData, // Assuming 'answers' is the field containing form data
          meditations: meditationData // Send the list of meditations
        });

        // Update state with recommendations received from the backend
        const similarMeditationNames = response.data.similar_meditations_names || [];
        const filteredMeditations = meditationData.filter(meditation =>
          similarMeditationNames.includes(meditation.name)
        );
        setMeditations(filteredMeditations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };
    fetchRecommendations();
  }, []);

  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  const filteredMeditations = meditations.filter(meditation =>
    meditation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='private-analysis'>
      <div className='search'>
        <input
          type="text"
          placeholder="Search meditations"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <ul>
        {filteredMeditations.map(meditation => (
          <Link key={meditation.id} to={`/meditate/${meditation.id}`}>
            <li>
              <p>{meditation.name}</p>
              <p>Duration: {meditation.duration}</p>
              <p>Tag: {meditation.tag}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default PrivateAnalysis;
