import React, { useState, useEffect } from 'react';
import { ListGroup, Form, Button } from 'react-bootstrap';
import Comment from './Comment';

const FlatCommentThread = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments from the database on component mount
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
  
    const commentData = {
      text: newComment,
      thumbsUp: 0,
      thumbsDown: 0,
      userId: 1, // Replace 1 with the actual user ID from your frontend or authentication system
    };
  
    try {
      // Send a POST request to add the comment to the database
      const response = await fetch('http://localhost:8082/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
  
      if (response.ok) {
        // Comment added successfully, fetch updated comments
        await fetchComments();
        setNewComment('');
  
        // Save the username to localStorage
        localStorage.setItem('commentUsername', 'YourUsername'); // Replace 'YourUsername' with the actual username
      } else {
        console.error('Failed to add comment:', response);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  return (
    <div>
      <h2>Flat Comment Thread</h2>
      <ListGroup variant="flush">
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} />
        ))}
      </ListGroup>

      {/* Comment Submission Form */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentForm">
          <Form.Label>Add a comment:</Form.Label>
          <Form.Control
            type="text"
            value={newComment}
            onChange={handleInputChange}
            placeholder="Type your comment here..."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default FlatCommentThread;
