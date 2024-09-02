import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import { useNavigate } from 'react-router-dom';

const MapPage = () => {
  console.log('Rendering MapPage');
  const navigate = useNavigate();
  const [position, setPosition] = useState([37.983810, 23.727539]); // Default position (Athens, Greece)
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('useEffect called');
    const storedUser = localStorage.getItem('user');
    console.log('User:', storedUser);

    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser && parsedUser.latitude && parsedUser.longtitude) {
          setUser(parsedUser);
          setPosition([parsedUser.latitude, parsedUser.longtitude]);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user'); // Αφαίρεση του μη έγκυρου αντικειμένου
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const MapWithLocateControl = () => {
    const map = useMap();

    useEffect(() => {
      console.log('MapWithLocateControl useEffect called'); // Προσθήκη για εντοπισμό του προβλήματος

      // Check if locate control already exists
      if (!map._locateControl) {
        const lc = L.control.locate({
          position: 'bottomright',
          setView: 'always',
          flyTo: true,
          keepCurrentZoomLevel: true,
          onLocationError: (err) => {
            console.error('Geolocation error:', err.message);
            alert('Geolocation error: ' + err.message);
          },
        }).addTo(map);

        // Store the locate control instance in the map object
        map._locateControl = lc;
        lc.start();
      }
    }, [map]);

    return null;
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">e-ethelodria</Navbar.Brand>
          <Nav className="me-auto">
            {user.is_admin && <Nav.Link href="#create-account">Δημιουργία accounts</Nav.Link>}
          </Nav>
          <Nav>
            <Nav.Link href="#user">{user.username}</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container fluid className="p-0">
        <MapContainer center={position} zoom={13} style={{ height: '90vh' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              You are here.
            </Popup>
          </Marker>
          <MapWithLocateControl />
        </MapContainer>
      </Container>
    </>
  );
};

export default MapPage;
