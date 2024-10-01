import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import authService from '../services/authService';

const SignupModal = ({ show, handleClose, setMessage }) => {
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupTelephone, setSignupTelephone] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupSurname, setSignupSurname] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!signupUsername || !signupPassword || !signupEmail || !signupTelephone || !signupName || !signupSurname) {
      setError('All fields are mandatory.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Telephone validation (basic example, adjust as needed)
    const telephoneRegex = /^[0-9]{10,15}$/;
    if (!telephoneRegex.test(signupTelephone)) {
      setError('Please enter a valid telephone number.');
      return;
    }

    const response = await authService.signup({
      username: signupUsername,
      password: signupPassword,
      email: signupEmail,
      telephone: signupTelephone,
      name: signupName,
      surname: signupSurname,
    });
    console.log('Signup response:', response);
    if (response.message === 'User created') {
      setShowSuccess(true);
      // Clear the form fields
      setSignupUsername('');
      setSignupPassword('');
      setSignupEmail('');
      setSignupTelephone('');
      setSignupName('');
      setSignupSurname('');
      setError('');
    } else if (response.message === 'User already exists') {
      setError('User already exists. Please choose a different username.');
    } else {
      setError(response.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="formSignupUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSignupPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSignupEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSignupTelephone" className="mb-3">
              <Form.Label>Telephone</Form.Label>
              <Form.Control
                type="text"
                value={signupTelephone}
                onChange={(e) => setSignupTelephone(e.target.value)}
                placeholder="Enter telephone"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSignupName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formSignupSurname" className="mb-3">
              <Form.Label>Surname</Form.Label>
              <Form.Control
                type="text"
                value={signupSurname}
                onChange={(e) => setSignupSurname(e.target.value)}
                placeholder="Enter surname"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {showSuccess && (
        <Alert style={{margin:'20px'}} variant="success" onClose={() => setShowSuccess(false)} dismissible>
          Your account has been successfully created! You can now log in.
        </Alert>
      )}
    </>
  );
};

export default SignupModal;
