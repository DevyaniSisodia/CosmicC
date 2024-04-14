import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase'; // Update the import statement for Firebase
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts from Firebase
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('upvotes', 'desc')); // Order posts by upvotes in descending order
        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="forum">
      <div className="search searchBlack">
        <input
          type="text"
          placeholder="Search posts"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <div className="posts">
          <Link to={`/add-post`}>
          <div className="post">
            <h2>
            Create your own post
            </h2>
            </div>
          </Link>
        {filteredPosts.map(post => (
          <Link key={post.id} to={`/view-post/${post.id}`}>
            <div className="post">
              <h2>{post.title}</h2>
              <p>Upvotes: {post.upvotes.length}</p>
              <p>Author: {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Community;
