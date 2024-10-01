// src/pages/Login.js

import React, { useState } from 'react';
import authService from '../services/authService';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SignupModal from '../components/SignupModal';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await authService.login(username, password);
    console.log('Login response:', response);
    if (response.message === 'Login successful') {
      if (response.user.is_diasostis) {
        navigate('/map', { state: { user: response.user } });
      } else if (response.user.is_admin){
        navigate('/warehouse-management', { state: { user: response.user } });
      } else {
        navigate('/requests', { state: { user: response.user } });
      }
    } else {
      setMessage(response.message);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>

        <Button variant="secondary" className="ms-2" onClick={() => setShowSignup(true)}>
          Sign Up
        </Button>

        {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
      </Form>

      <SignupModal
        show={showSignup}
        handleClose={() => setShowSignup(false)}
        setMessage={setMessage}
      />
    </Container>
  );
};

export default Login;
