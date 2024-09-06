import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">e-ethelodria</Navbar.Brand>
        <Nav className="me-auto">
          {user && user.is_admin && (
            <>
              <Nav.Link href="#create-account">Δημιουργία accounts</Nav.Link>
              <Nav.Link onClick={() => navigate('/warehouse-management')}>Διαχείριση Αποθήκης</Nav.Link>
            </>
          )}
        </Nav>
        <Nav>
          {user && <Nav.Link href="#user">{user.username}</Nav.Link>}
          {user && <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
