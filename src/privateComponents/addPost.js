import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import './addPost.css'

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const postRef = collection(db, 'posts');
        await addDoc(postRef, {
          title: title,
          content: content,
          author: currentUser.displayName,
          uid: currentUser.uid,
          upvotes: [],
          comments: []
        });
        setTitle('');
        setContent('');
        console.log('Post added successfully!');
      } catch (error) {
        console.error('Error adding post:', error);
      }
    } else {
      console.log('User not authenticated.');
    }
  };

  return (
    <div className="create-post">
      <h2>Create a New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label><br/>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePost;
