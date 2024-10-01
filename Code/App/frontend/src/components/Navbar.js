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
    <Navbar bg="light" expand="lg" style={{ marginBottom: '20px' }}>
      <Container>
        <Navbar.Brand href="#home">e-ethelodria</Navbar.Brand>
        <Nav className="me-auto">
          {(user.is_admin || user.is_diasostis) ? (
            <>
            <Nav.Link onClick={() => navigate('/map')}>Χάρτης</Nav.Link>
            </>
          ):null}
          
          {user.is_admin ? (
            <>
              <Nav.Link onClick={() => navigate('/warehouse-management')}>Διαχείριση</Nav.Link>
              <Nav.Link onClick={() => navigate('/stats')}>Στατιστικά</Nav.Link>
              <Nav.Link onClick={() => navigate('/rescuer-management')}>Λογαριασμοί</Nav.Link>
              <Nav.Link onClick={() => navigate('/admin/announcements')}>Ανακοινώσεις</Nav.Link>
            </>
          ):null}
          
          {user.is_diasostis ? (
            <>
              <Nav.Link onClick={() => navigate('/vehicle-management')}>Φορτίο</Nav.Link>
            </>
          ):null}

          {user.is_citizen ? (
            <>
              <Nav.Link onClick={() => navigate('/requests')}>Αιτήματα</Nav.Link>
              {/* Placeholder for offers */}
              <Nav.Link onClick={() => navigate('/offers')}>Προσφορές</Nav.Link>
              </>
          ):null}
        </Nav>
        <Nav>
          {user?.username && <Nav.Link href="#user">{user.username}</Nav.Link>}
          {user && <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
