import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to e-ethelodria</h1>
      <p>Your platform for coordinating volunteers during natural disasters.</p>
      <Link to="/login">
        <Button variant="primary">Login</Button>
      </Link>
    </Container>
  );
};

export default Welcome;
