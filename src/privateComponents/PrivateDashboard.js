import React, { useEffect, useState } from 'react';
import { auth, db, doc, getDoc, updateProfile } from '../firebase';
import './PrivateDashboard.css';
import { Link } from 'react-router-dom';

const PrivateDashboard = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [newDisplayName, setNewDisplayName] = useState(''); // State to hold the new display name
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        updateGreeting();
        await fetchProfileImage(authUser.uid);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleChangeProfileImage = () => {
    // Logic to handle changing profile image
  };

  const handleChangeUsername = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName }); // Update display name in Firebase Authentication
      setUser(auth.currentUser); // Update user object in state to reflect changes
      setNewDisplayName(''); // Clear the input field
    } catch (error) {
      console.error('Error updating display name:', error);
    }
  };

  const updateGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 0 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const fetchProfileImage = async (userId) => {
    try {
      const profileImageDoc = doc(db, 'profileImages', userId);
      const profileImageSnapshot = await getDoc(profileImageDoc);
      if (profileImageSnapshot.exists()) {
        setProfileImage(profileImageSnapshot.data().imageUrl);
      } else {
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="private-dashboard">
      <h2>{`${greeting}, ${user.displayName || user.email}!`}</h2>
      <div className="button-list">
        <input
          type="text"
          placeholder="New Display Name"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
        />
        <button className="change-profile-image-button" onClick={handleChangeUsername}>Change Display Name</button>
        <Link to="/my-posts"><button> My Posts </button></Link>
        <Link to="/" onClick={handleLogout}><button>Logout</button></Link>
      </div>
    </div>
  );
};

export default PrivateDashboard;
