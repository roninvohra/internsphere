import React, { useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';

const Comment = ({ comment }) => {
  const [thumbsUp, setThumbsUp] = useState(comment.thumbsUp);
  const [thumbsDown, setThumbsDown] = useState(comment.thumbsDown);

  const handleThumbsUp = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/comments/${comment.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thumbsUp: thumbsUp + 1,
          thumbsDown,
        }),
      });
  
      if (response.ok) {
        setThumbsUp((prevThumbsUp) => prevThumbsUp + 1);
      } else {
        console.error('Failed to update comment:', response);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  const handleThumbsDown = async () => {
    try {
      const response = await fetch(`http://localhost:8082/api/comments/${comment.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thumbsUp,
          thumbsDown: thumbsDown + 1,
        }),
      });
  
      if (response.ok) {
        setThumbsDown((prevThumbsDown) => prevThumbsDown + 1);
      } else {
        console.error('Failed to update comment:', response);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };
  

  // Retrieve the username from localStorage
  const commentUsername = localStorage.getItem('username');

  return (
    <ListGroup.Item>
      <div>
        <strong>{commentUsername}:</strong> {comment.text}
      </div>
      <div>
        <Button variant="success" onClick={handleThumbsUp}>
          Thumbs Up ({thumbsUp})
        </Button>
        <Button variant="danger" onClick={handleThumbsDown}>
          Thumbs Down ({thumbsDown})
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default Comment;
