import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './editPost.css';
const EditPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          setPost(postSnapshot.data());
          setNewTitle(postSnapshot.data().title);
          setNewContent(postSnapshot.data().content);
        } else {
          console.error('No such post found!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setNewContent(e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        title: newTitle,
        content: newContent,
      });
      console.log('Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  

  return (
    <div className='create-post'>
      <h2>Edit Post</h2>
      {post && (
        <div>
            <form>
            <div className="form-group">
            <label htmlFor="title">Title:</label><br/>
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={handleTitleChange}
              placeholder={post.title}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={newContent}
              onChange={handleContentChange}
            >{post.content}</textarea>
          </div>
          <button onClick={handleSaveChanges}>Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditPost;
