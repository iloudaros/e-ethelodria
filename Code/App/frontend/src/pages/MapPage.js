import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import '../App.css';

import { Modal, Button } from 'react-bootstrap';

// Εισαγωγή του Leaflet
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet.locatecontrol';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

// Custom Components
import CustomNavbar from '../components/Navbar';
import InventoryList from '../components/InventoryList';

// Ειδικά Εικονίδια για το Leaflet
import { icons } from '../assets/icons';

// Toggle options
const toggleOptions = {
    requestsPending: 'requestsPending',
    requestsAccepted: 'requestsAccepted',
    offersPending: 'offersPending',
    offersAccepted: 'offersAccepted',
    vehiclesActive: 'vehiclesActive',
    vehiclesInactive: 'vehiclesInactive',
    polylines: 'polylines'
};

const MapPage = () => {
    console.log('Rendering MapPage');
    const navigate = useNavigate();
    const [position, setPosition] = useState(null); // Default position (Athens, Greece)
    const [user, setUser] = useState(null);
    const [base, setBase] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [requests, setRequests] = useState([]);
    const [offers, setOffers] = useState([]);
    const [visiblePolyline, setVisiblePolyline] = useState(null);
    const [filters, setFilters] = useState({
        [toggleOptions.requestsPending]: true,
        [toggleOptions.requestsAccepted]: true,
        [toggleOptions.offersPending]: true,
        [toggleOptions.offersAccepted]: true,
        [toggleOptions.vehiclesActive]: true,
        [toggleOptions.vehiclesInactive]: true,
        [toggleOptions.polylines]: true
    });
    const [showModal, setShowModal] = useState(false);
    const [newBaseLocation, setNewBaseLocation] = useState(null);
    
    
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
                            
                        if (parsedUser.is_admin)  {
                            // Αποθήκη
                            console.log(`Fetching base location of admin with admin_id: ${parsedUser.id}`);
                            axios.get(`http://localhost:3000/api/base/baseInfo/${parsedUser.id}`)
                            .then((response) => {
                                console.log(`base location - lat:${response.data.latitude}, long:${response.data.longitude}`);
                                setBase({id: response.data.id, latitude: response.data.latitude, longitude: response.data.longitude});
                            })}

                            if (parsedUser.is_admin || parsedUser.is_diasostis) {
                            
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
        console.log('VehicleMarkers component called');
        return (
            <>
            {vehicles
                .filter(vehicle => {
                    if (filters[toggleOptions.vehiclesActive] && vehicle.tasks.length > 0) {
                        return true;
                    }
                    if (filters[toggleOptions.vehiclesInactive] && vehicle.tasks.length === 0) {
                        return true;
                    }
                    return false;
                })
                .map((vehicle) => (
                    <Marker key={vehicle.id} position={[vehicle.latitude, vehicle.longitude]} icon={icons.rescueIcon} 
                    eventHandlers={{
                        popupopen: () => {
                            console.log('Marker clicked for vehicle with id:', vehicle.id);
                            setVisiblePolyline(vehicle.id);
                        },
                        popupclose: () => {
                            console.log('Marker closed for vehicle with id:', vehicle.id);
                            setVisiblePolyline(null);
                        }
                    }}
                    >
                    <Popup>
                    <h3>{vehicle.username}</h3>
                    <p>ID: {vehicle.id}</p>
                    <h5>Inventory</h5>
                    <InventoryList id={vehicle.id} />
                    <p>Κατάσταση: {vehicle.state}</p>
                    {visiblePolyline === vehicle.id && filters[toggleOptions.polylines] && (
                        vehicle.tasks.map((task) => (
                            <Polyline
                            key={task.id}
                            positions={[
                                [vehicle.latitude, vehicle.longitude],
                                [task.userLocation.latitude, task.userLocation.longitude]
                            ]}
                            color="grey"
                            />
                        ))
                    )}
                    </Popup>
                    </Marker>
                ))}
                </>
            );
        }
        
        // Component για να προβάλουμε τους markers των αιτημάτων
        function RequestMarkers() {
            console.log('RequestMarkers component called');
            return (
                <>
                <MarkerClusterGroup chunkedLoading>
                {requests
                    .filter(request => {
                        if (filters[toggleOptions.requestsPending] && request.state === 'published') {
                            return true;
                        }
                        if (filters[toggleOptions.requestsAccepted] && request.state !== 'published') {
                            return true;
                        }
                        return false;
                    })
                    .map((request) => (
                        <Marker key={request.id} position={[request.userLocation.latitude, request.userLocation.longitude]} icon={request.state === 'published' ? icons.requestIcon : icons.requestIconOk} >
                        <Popup>
                        <h3>Request</h3>
                        <table>
                        <tbody>
                        <tr>
                        <td>Χρήστης:</td>
                        <td>{request.userName}</td>
                        </tr>
                        <tr>
                        <td>Τηλέφωνο:</td>
                        <td>{request.userTelephone}</td>
                        </tr>
                        <tr>
                        <td>Κατάσταση:</td>
                        <td>{request.state}</td>
                        </tr>
                        <tr>
                        <td>Καταχώρηση:</td>
                        <td>{request.date_in.split('T')[0]}</td>
                        </tr>
                        <tr>
                        <td>Κατανομή:</td>
                        <td>{request.accepted_in.split('T')[0]}</td>
                        </tr>
                        <tr>
                        <td>Αποστολή:</td>
                        <td>{request.date_out.split('T')[0]}</td>
                        </tr>
                        </tbody>
                        </table>
                        <h5 style={{marginTop:'10px'}}>Ανάγκες</h5>
                        <InventoryList id={request.id} />
                        </Popup>
                        </Marker>
                    ))}
                    </MarkerClusterGroup>
                    </>
                );
            }
            
            // Component για να προβάλουμε τους markers των προσφορών
            function OfferMarkers() {
                return (
                    <>
                    <MarkerClusterGroup chunkedLoading>
                    {offers
                        .filter(offer => {
                            if (filters[toggleOptions.offersPending] && offer.state === 'published') {
                                return true;
                            }
                            if (filters[toggleOptions.offersAccepted] && offer.state !== 'published') {
                                return true;
                            }
                            return false;
                        })
                        .map((offer) => (
                            <Marker key={offer.id} position={[offer.userLocation.latitude, offer.userLocation.longitude]} icon={offer.state === 'published' ? icons.offerIcon : icons.offerIconOk} >
                            <Popup>
                            <h3>Offer</h3>
                            <table>
                            <tbody>
                            <tr>
                            <td>Χρήστης:</td>
                            <td>{offer.userName}</td>
                            </tr>
                            <tr>
                            <td>Τηλέφωνο:</td>
                            <td>{offer.userTelephone}</td>
                            </tr>
                            <tr>
                            <td>Κατάσταση:</td>
                            <td>{offer.state}</td>
                            </tr>
                            <tr>
                            <td>Καταχώρηση:</td>
                            <td>{offer.date_in.split('T')[0]}</td>
                            </tr>
                            <tr>
                            <td>Κατανομή:</td>
                            <td>{offer.accepted_in.split('T')[0]}</td>
                            </tr>
                            <tr>
                            <td>Παραλαβή:</td>
                            <td>{offer.date_out.split('T')[0]}</td>
                            </tr>
                            </tbody>
                            </table>
                            <h5 style={{marginTop:'10px'}}>Δωρεά</h5>
                            <InventoryList id={offer.id} />
                            </Popup>
                            </Marker>
                        ))}
                        </MarkerClusterGroup>
                        </>
                    );
                }
                
                const handleToggleChange = (event) => {
                    const { name, checked } = event.target;
                    setFilters(prevFilters => ({
                        ...prevFilters,
                        [name]: checked
                    }));
                };
                
                // Handler for updating base location
                const handleConfirmBaseLocation = async () => {
                    try {
                        console.log('Base location before update:', base);
                        await axios.post('http://localhost:3000/api/base/updateLocation', {
                            id: base.id,
                            latitude: newBaseLocation.latitude,
                            longitude: newBaseLocation.longitude
                        });
                        console.log('Base location updated in the database');
                        setBase(prevBase => ({ ...prevBase, latitude: newBaseLocation.latitude, longitude: newBaseLocation.longitude }));
                        setShowModal(false);
                    } catch (error) {
                        console.error('Error updating base location:', error);
                    }
                };
                
                const handleBaseDragEnd = (event) => {
                    const { lat, lng } = event.target.getLatLng();
                    setNewBaseLocation({ latitude: lat, longitude: lng });
                    setShowModal(true);
                };
                
                
                if (!user || !position || (!user.is_citizen && (!base || !vehicles || !requests || !offers))) {
                    return <p>Loading...</p>;
                }
                
                return (
                    <>
                    <CustomNavbar user={user} />
                    
                    <Container fluid className="p-0">
                    <Card style={{ margin: '20px', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    <Card.Body>
                    <Form>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Form.Check 
                    type="switch"
                    id="requestsPending"
                    name={toggleOptions.requestsPending}
                    label="Αιτήματα σε εκκρεμότητα"
                    checked={filters.requestsPending}
                    onChange={handleToggleChange}
                    />
                    <Form.Check 
                    type="switch"
                    id="requestsAccepted"
                    name={toggleOptions.requestsAccepted}
                    label="Αναληφθέντα αιτήματα"
                    checked={filters.requestsAccepted}
                    onChange={handleToggleChange}
                    />
                    <Form.Check 
                    type="switch"
                    id="offersPending"
                    name={toggleOptions.offersPending}
                    label="Προσφορές σε εκκρεμότητα"
                    checked={filters.offersPending}
                    onChange={handleToggleChange}
                    />
                    <Form.Check 
                    type="switch"
                    id="offersAccepted"
                    name={toggleOptions.offersAccepted}
                    label="Αναληφθείσες προσφορές"
                    checked={filters.offersAccepted}
                    onChange={handleToggleChange}
                    />
                    <Form.Check 
                    type="switch"
                    id="vehiclesActive"
                    name={toggleOptions.vehiclesActive}
                    label="Οχήματα με ενεργά tasks"
                    checked={filters.vehiclesActive}
                    onChange={handleToggleChange}
                    />
                    <Form.Check 
                    type="switch"
                    id="vehiclesInactive"
                    name={toggleOptions.vehiclesInactive}
                    label="Οχήματα χωρίς ενεργά tasks"
                    checked={filters.vehiclesInactive}
                    onChange={handleToggleChange}
                    />
                    <Form.Check 
                    type="switch"
                    id="polylines"
                    name={toggleOptions.polylines}
                    label="Polylines"
                    checked={filters.polylines}
                    onChange={handleToggleChange}
                    />
                    </div>
                    </Form>
                    </Card.Body>
                    </Card>
                    
                    <MapContainer center={position} zoom={13} style={{ height: '84vh' }}>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapWithLocateControl />
                    
                    {/* Εμφάνιση της θέσης της βάσης */}
                    <Marker position={[base.latitude, base.longitude]} icon={icons.baseIcon} draggable={true} eventHandlers={{ dragend: handleBaseDragEnd }}>
                    <Popup>
                    <h3>Βάση</h3>
                    <p>Τοποθεσία: {base.latitude}, {base.longitude}</p>
                    </Popup>
                    </Marker>
                    
                    {/* Εμφάνιση των θέσεων των οχημάτων διασωστών */}
                    <VehicleMarkers/>
                    
                    {/* Εμφάνιση της θέσης των αιτημάτων*/} 
                    <RequestMarkers/>
                    
                    {/* Εμφάνιση της θέσης των προσφορών*/}
                    <OfferMarkers/>
                    
                    </MapContainer>
                    </Container>
                    
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Confirm Base Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <p>Are you sure you want to update the base location to:</p>
                    <p>Latitude: {newBaseLocation?.latitude}</p>
                    <p>Longitude: {newBaseLocation?.longitude}</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmBaseLocation}>
                    Confirm
                    </Button>
                    </Modal.Footer>
                    </Modal>
                    </>
                );
            };
            
            export default MapPage;
            