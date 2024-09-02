import React, { useState } from 'react';
import authService from '../services/authService';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [usernames, setUsernames] = useState([]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await authService.login(username, password);
    console.log('Login response:', response); // Προσθήκη για εντοπισμό του προβλήματος
    if (response.message === 'Login successful') {
      navigate('/map', { state: { user: response.user } });
    } else {
      setMessage(response.message);
      setUsernames(response.usernames || []);
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

        {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        {usernames.length > 0 && (
          <Alert variant="info" className="mt-3">
            Here are some existing users: {usernames.join(', ')}
          </Alert>
        )}
      </Form>
    </Container>
  );
};

export default Login;
