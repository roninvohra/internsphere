import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import React, { useState } from 'react';
import NavBar from "./NavBar";
import { useNavigate } from 'react-router-dom'; 
import logo from '../logo.png'

export default function Login() {
  const [username, setUsername] = useState ('');
  const [password, setPassword] = useState ('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8082/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Assuming your backend returns a success status (e.g., 200) for successful logins
      if (response.status === 200) {
        // Handle successful login, e.g., redirect to the main application
        const data = await response.json();
        const loggedInUser = data.user.id;
        localStorage.setItem('loggedInUser', loggedInUser );
        localStorage.setItem ('username', username)
        navigate('/');
      } else {
        // Handle unsuccessful login, e.g., display an error message
      }
    } catch (error) {
      // Handle errors, e.g., display a generic error message
    }
  };

  return (
    <div>
      <NavBar />
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
          <div className="border border-2 border-primary"></div>
            <Card className="shadow px-4">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                  <div align = "center">
                  <img
            src={logo}
            alt="Logo"
            width = "300"
             // Adjust the height as needed
            className="d-inline-block align-top"
          />
                  </div>
                  <div className="mb-3">
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="mb-3" controlId="Name">
                        <Form.Label className="text-center">
                          Username
                        </Form.Label>
                        <Form.Control type="text" placeholder="Enter username"  value = {username} onChange={(e) => setUsername(e.target.value)}/>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)} />
                      </Form.Group>
                      <div className="d-grid">
                        <Button variant="primary" type="submit">
                          Login
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
