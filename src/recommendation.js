// Replace import statements with require
const { getDocs, collection } = require('firebase/firestore');
const { db } = require('./firebase'); // Assuming you have a file exporting your Firebase db instance

// Your other code here
// ...

// Example usage of getDocs and collection
const getMeditations = async () => {
  try {
    const meditationsCollection = collection(db, 'meditations');
    const querySnapshot = await getDocs(meditationsCollection);

    const meditations = [];
    querySnapshot.forEach((doc) => {
      meditations.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    console.log('Meditations:', meditations);
  } catch (error) {
    console.error('Error getting meditations:', error.code, error.message);
  }
};

// Call the function to get meditations
getMeditations();
