import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../logo.png'

function NavBar() {
  return (
    <Navbar fixed="top" expand="lg" className="bg-body-tertiary">
      <Container>
      <Navbar.Brand href="/">
        
          <img
            src={logo}
            alt="Logo"
            width = "33" // Adjust the height as needed
            className="d-inline-block align-top"
            />
        
          
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          {/* Push the username to the right side */}
          <Nav>
          <Nav.Link href="/feedback">Feedback</Nav.Link>
          {!localStorage.getItem('loggedInUser') && <Nav.Link href="/signup">Sign Up</Nav.Link>}
            {!localStorage.getItem('loggedInUser') && <Nav.Link href="/login">Login</Nav.Link>}
            {localStorage.getItem('loggedInUser') && <Nav.Link href="/signout">Logout</Nav.Link>}
            {localStorage.getItem('loggedInUser') && <Nav.Link disabled>{localStorage.getItem('username')}</Nav.Link>}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
