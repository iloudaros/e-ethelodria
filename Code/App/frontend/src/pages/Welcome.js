// src/pages/Welcome.js

import React, { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignupModal from '../components/SignupModal';

const Welcome = () => {
  const [showSignup, setShowSignup] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to e-ethelodria</h1>
      <p>Your platform for coordinating volunteers during natural disasters.</p>
      <Link to="/login">
        <Button variant="primary" className="me-2">Login</Button>
      </Link>
      <Button variant="secondary" onClick={() => setShowSignup(true)}>
        Sign Up
      </Button>

      {message && <Alert variant="success" className="mt-3">{message}</Alert>}

      <SignupModal
        show={showSignup}
        handleClose={() => setShowSignup(false)}
        setMessage={setMessage}
      />
    </Container>
  );
};

export default Welcome;
