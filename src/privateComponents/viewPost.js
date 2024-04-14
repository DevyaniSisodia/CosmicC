import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './viewPost.css';

const ViewPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          setPost(postSnapshot.data());
          const currentUser = auth.currentUser;
          if (currentUser && postSnapshot.data().upvotes.includes(currentUser.uid)) {
            setUserLiked(true);
          }
        } else {
          console.error('No such post found!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const postRef = doc(db, 'posts', postId);
        const postSnapshot = await getDoc(postRef);
        const postLikes = postSnapshot.data().upvotes;
        if (!postLikes.includes(currentUser.uid)) {
          await updateDoc(postRef, {
            upvotes: arrayUnion(currentUser.uid)
          });
          setPost({ ...post, upvotes: [...postLikes, currentUser.uid] });
          setUserLiked(true);
        } else {
          await updateDoc(postRef, {
            upvotes: arrayRemove(currentUser.uid)
          });
          setPost({ ...post, upvotes: postLikes.filter(uid => uid !== currentUser.uid) });
          setUserLiked(false);
        }
      } else {
        console.log('User not authenticated.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          comments: arrayUnion({
            author: currentUser.displayName || currentUser.email,
            comment: commentText,
            timestamp: new Date().toISOString()
          })
        });
        setCommentText('');
        // Fetch the updated post to display the new comment
        const updatedPostSnapshot = await getDoc(postRef);
        if (updatedPostSnapshot.exists()) {
          setPost(updatedPostSnapshot.data());
        }
      } else {
        console.log('User not authenticated.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className='DetailedPost'>
      {post && (
        <div className="post">
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <div className="metadata">
            <p>Upvotes: {post.upvotes.length}</p>
            <p>Author: {post.author}</p>
          </div>
          <div className="comments">
            <h3>Comments:</h3>
            <ul>
              {post.comments && Object.keys(post.comments).map((commentKey) => {
                const comment = post.comments[commentKey];
                return (
                  <li key={commentKey}>
                    <p>Author: {comment.author}</p>
                    <p>Comment: {comment.comment}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <button className="like-button" onClick={handleLike}>
            {userLiked ? (
              <React.Fragment>
                <FontAwesomeIcon icon={faThumbsUp} /> Remove Like
              </React.Fragment>
            ) : (
              <React.Fragment>
                <FontAwesomeIcon icon={faThumbsUp} /> Like
              </React.Fragment>
            )}
          </button>
        </div>
      )}
        <div className="comment-card">
          <form onSubmit={handleCommentSubmit}>
              <textarea
                placeholder="Write your comment here"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit">Add comment</button>
            </form>
          </div>
    </div>
  );
};

export default ViewPost;
