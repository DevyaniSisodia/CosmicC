import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './Community.css';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = auth.currentUser;

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

  // Filter posts based on search query and current user
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    post.uid === currentUser.uid 
  );

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(posts.filter(post => post.id !== postId));
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

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
        {filteredPosts.map(post => (
          <div key={post.id} className="post">
            <h2>{post.title}</h2>
            <p>Upvotes: {post.upvotes.length}</p>
            {currentUser && currentUser.uid === post.uid && (
              <div>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                <Link to={`/edit-post/${post.id}`}>Edit</Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
