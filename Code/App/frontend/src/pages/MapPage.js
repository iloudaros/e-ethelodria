import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import CustomNavbar from '../components/Navbar';

import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet.locatecontrol';
import axios from 'axios';


// Ειδικά Εικονίδια για το Leaflet
import {icons} from '../assets/icons';

console.log('Leaflet icons:', icons.baseIcon);



const MapPage = () => {
    console.log('Rendering MapPage');
    const navigate = useNavigate();
    const [position, setPosition] = useState(null); // Default position (Athens, Greece)
    const [user, setUser] = useState(null);
    const [base, setBase] = useState(null);
    
    
    // Χρήση useEffect για να ανακτήσουμε το χρήστη από το localStorage
    useEffect(() => {
        console.log('Get user location useEffect called');
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('User:', parsedUser);
                
                if (parsedUser) {
                    setUser(parsedUser);
                    // Ανακτούμε την αποθηκευμένη θέση του χρήστη από το backend
                    axios.get(`http://localhost:3000/api/users/location/${parsedUser.username}`)
                    .then((response) => {
                        console.log(`Last User location - lat:${response.data.latitude}, long:${response.data.longitude}`);
                        
                        const { latitude, longitude } = response.data;
                        setPosition([latitude, longitude]);
                        
                        // Αν ο χρήστης είναι admin, συλλέγουμε επίσης την θέση της αποθηκής
                        if (parsedUser.is_admin) {
                            console.log(`User is admin, fetching warehouse location of admin with admin_id:${parsedUser.id}`);
                            axios.get(`http://localhost:3000/api/warehouse/${parsedUser.id}`)
                            .then((response) => {
                                console.log(`Warehouse location - lat:${response.data.latitude}, long:${response.data.longitude}`);
                                setBase({id: response.data.id, latitude: response.data.latitude, longitude: response.data.longitude});
                            })
                        }
                        
                        
                        
                    })
                    .catch((error) => {
                        console.error('Error fetching user location:', error);
                    });
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
    
    
    
    // Χρήση useEffect για την αρχική φόρτωση της θέσης του χρήστη στο χάρτη
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
                map.on('locationfound', async (e) => {
                    console.log('Location found:', e.latlng);
                    try {
                        await axios.post('http://localhost:3000/api/users/location', {
                            username: user.username,
                            latitude: e.latlng.lat,
                            longitude: e.latlng.lng
                        });
                        console.log('Location updated in the database');
                    } catch (error) {
                        console.error('Error updating location:', error);
                    }
                    setPosition([e.latlng.lat, e.latlng.lng]);
                });
            }
        }, [map]);
        
        return null;
    };
    
    if (!user || !position || !base) {
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
        // Εμφάνιση της θέσης της βάσης
        <Marker position={[base.latitude, base.longitude]} icon={icons.baseIcon} >
        <Popup>
        <h3>Βάση</h3>
        <p>Τοποθεσία: {base.latitude}, {base.longitude}</p>
        </Popup>
        </Marker>
        </MapContainer>
        </Container>
        </>
    );
};

export default MapPage;
