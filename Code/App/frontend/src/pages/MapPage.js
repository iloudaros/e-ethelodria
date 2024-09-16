import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';

// Εισαγωγή του Leaflet
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet.locatecontrol';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

// Custom Components
import CustomNavbar from '../components/Navbar';

// Ειδικά Εικονίδια για το Leaflet
import {icons} from '../assets/icons';
import '../assets/icons.css';


const MapPage = () => {
    console.log('Rendering MapPage');
    const navigate = useNavigate();
    const [position, setPosition] = useState(null); // Default position (Athens, Greece)
    const [user, setUser] = useState(null);
    const [base, setBase] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [requests, setRequests] = useState([]);
    const [offers, setOffers] = useState([]);
    
    
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
                        
                        // Αν ο χρήστης είναι admin, συλλέγουμε επίσης τα επιπλέον στοιχεία που πρέπει να εμφανίζονται στο χάρτη
                        if (parsedUser.is_admin) {
                            console.log(`User is admin.`) 
                            
                            // Αποθήκη
                            console.log(`Fetching warehouse location of admin with admin_id: ${parsedUser.id}`);
                            axios.get(`http://localhost:3000/api/warehouse/${parsedUser.id}`)
                            .then((response) => {
                                console.log(`Warehouse location - lat:${response.data.latitude}, long:${response.data.longitude}`);
                                setBase({id: response.data.id, latitude: response.data.latitude, longitude: response.data.longitude});
                            })
                            
                            // Οχήματα
                            console.log(`Fetching vehicles of rescuers`);
                            axios.get(`http://localhost:3000/api/vehicle/all`)
                            .then((response) => {
                                console.log(`Vehicles fetched: ${response.data.length}`);
                                console.log(response.data);
                                setVehicles(response.data);
                            })
                            
                            // Αιτήματα
                            console.log(`Fetching requests`);
                            axios.get(`http://localhost:3000/api/requests/all`)
                            .then ((response) => {
                                console.log(`Requests fetched: ${response.data.length}`);
                                console.log(response.data);
                                setRequests(response.data);
                            })
                            
                            
                            // Προσφορές
                            console.log(`Fetching offers`);
                            axios.get(`http://localhost:3000/api/offers/all`)
                            .then ((response) => {
                                console.log(`Offers fetched: ${response.data.length}`);
                                console.log(response.data);
                                setOffers(response.data);
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
    
    
    // Component για να προβάλουμε τους markers των οχημάτων
    function VehicleMarkers() {
        return (
            <>
            {vehicles.map((vehicle) => (
                <Marker key={vehicle.id} position={[vehicle.latitude, vehicle.longitude]} icon={icons.rescueIcon} >
                <Popup>
                <h3>{vehicle.username}</h3>
                <p>ID: {vehicle.id}</p>
                <p>Κατάσταση: {vehicle.state}</p>
                <p>Τοποθεσία: {vehicle.latitude}, {vehicle.longitude}</p>
                </Popup>
                </Marker>
            ))}
            </>
        );
    }
    
    // Component για να προβάλουμε τους markers των αιτημάτων
    function RequestMarkers() {
        return (
            <>
            <MarkerClusterGroup 
            chunkedLoading
            >
            {requests.map((request) => (
                <Marker key={request.id} position={[request.userLocation.latitude, request.userLocation.longitude]} icon={request.state=='published'?icons.requestIcon:icons.requestIconOk} >
                <Popup>
                <h3>Request</h3>
                <p>ID: {request.id}</p>
                <p>Κατάσταση: {request.state}</p>
                <p>Τοποθεσία: {request.userLocation.latitude}, {request.userLocation.longitude}</p>
                <p>Καταχώρηση: {request.date_in}</p>
                <p>Κατανομή: {request.accepted_in}</p>
                <p>Αποστολή: {request.date_out}</p>
                </Popup>
                </Marker>
            ))}
            </MarkerClusterGroup>
            </>
        );
    }
    
    
    
    // Component για να προβάλουμε τους markers των προσφορών
    function OffertMarkers() {
        return (
            <>
            <MarkerClusterGroup 
            chunkedLoading
            >
            {offers.map((offer) => (
                <Marker key={offer.id} position={[offer.userLocation.latitude, offer.userLocation.longitude]} icon={offer.state=='published'?icons.offerIcon:icons.offerIconOk} >
                <Popup>
                <h3>Offer</h3>
                <p>ID: {offer.id}</p>
                <p>Κατάσταση: {offer.state}</p>
                <p>Τοποθεσία: {offer.userLocation.latitude}, {offer.userLocation.longitude}</p>
                <p>Καταχώρηση: {offer.date_in}</p>
                <p>Κατανομή: {offer.accepted_in}</p>
                <p>Αποστολή: {offer.date_out}</p>
                </Popup>
                </Marker>
            ))}
            </MarkerClusterGroup>
            </>
        );
    }
    
    if (!user || !position || (!user.is_citizen && (!base || !vehicles || !requests || !offers))) {
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
        {/* Εμφάνιση της θέσης της βάσης */}
        <Marker position={[base.latitude, base.longitude]} icon={icons.baseIcon} >
        <Popup>
        <h3>Βάση</h3>
        <p>Τοποθεσία: {base.latitude}, {base.longitude}</p>
        </Popup>
        </Marker>
        {/* Εμφάνιση των θέσεων των οχημάτων διασωστών */}
        <VehicleMarkers/>
        
        <MarkerClusterGroup chunkedLoading>
        {/* Εμφάνιση της θέσης των αιτημάτων*/} 
        <RequestMarkers/>
        
        {/* Εμφάνιση της θέσης των προσφορών*/}
        <OffertMarkers/>
        </MarkerClusterGroup>
        </MapContainer>
        </Container>
        </>
    );
};

export default MapPage;
