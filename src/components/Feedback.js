import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import NavBar from './NavBar';

const Feedback = () => {
  const [jobLink, setJobLink] = useState('');
  const [submitted, setSubmitted] = useState(false); // New state for submission status

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the jobLink is not empty before proceeding
    if (!jobLink.trim()) {
      console.error('Job link cannot be empty');
      return;
    }

    // Create the data object to be sent in the request body
    const data = { link: jobLink };

    try {
      const response = await fetch(process.env.REACT_APP_API_ENDPOINT + '/api/feedback/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Job link submitted successfully:', jobLink);
        // Reset the form after successful submission
        setJobLink('');
        // Update the submission status to show the "Thank you" card
        setSubmitted(true);
      } else {
        console.error('Failed to submit job link');
        // Handle the error if needed
      }
    } catch (error) {
      console.error('Error occurred while submitting job link:', error);
      // Handle the error if needed
    }
  };

  return (
    <div>
      <NavBar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card style={{ width: '50rem', margin: '0 auto', marginTop: '20px' }}>
          <Card.Body>
            <Card.Title>Submit a Job Posting</Card.Title>
            <Card.Text>If we are missing a job posting, submit the link here!</Card.Text>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="jobLink">
                <Form.Label>Job Link</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter the link to the job posting"
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                  required
                />
              </Form.Group>
              <Button style ={{marginTop : '5px'}} variant="primary" type="submit">
                Submit
              </Button>
            </Form>
            {submitted && (
          <Alert style={{ width: '50rem', marginTop: '10px' }} variant="success">
            Thank you for submitting this job!
          </Alert>
        )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
