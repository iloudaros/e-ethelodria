import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Container } from 'react-bootstrap';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';

const MapPage = () => {
    console.log('Rendering MapPage');
    const navigate = useNavigate();
    const [position, setPosition] = useState(); 
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        console.log('useEffect called');
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('User:', parsedUser);
                
                if (parsedUser && parsedUser.latitude && parsedUser.longitude) {
                    setUser(parsedUser);
                    setPosition([parsedUser.latitude, parsedUser.longitude]);
                } else {
                    throw new Error('Invalid user data');
                }
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('user'); 
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);
    
    const MapWithLocateControl = () => {
        const map = useMap();
        
        useEffect(() => {
            console.log('MapWithLocateControl useEffect called');
            
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
                    }
                }).addTo(map);
                
                // Store the locate control instance in the map object
                map._locateControl = lc;
                
                // Follow the user's position
                lc.start();
                
                // Update the position state when the user's position changes
                map.on('locationfound', (e) => {
                    console.log('Location found:', e.latlng);
                    try {
                        axios.post('http://localhost:3000/api/users/location', {
                            username: user.username,
                            latitude: e.latlng.lat,
                            longitude: e.latlng.lng
                        });
                        console.log('Location updated in the database');
                    }
                    catch (error) {
                        console.error('Error updating location:', error);
                    }
                    setPosition([e.latlng.lat, e.latlng.lng]);
                });
            }
        }, [map]);
        
        return null;
    };
    
    if (!user) {
        return <p>Loading...</p>;
    }
    
    return (
        <>
        <CustomNavbar user={user} />
        <Container fluid className="p-0">
        <MapContainer center={position} zoom={13} style={{ height: '90vh' }}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithLocateControl />
        </MapContainer>
        </Container>
        </>
    );
};

export default MapPage;
