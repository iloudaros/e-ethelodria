import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Card, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet.locatecontrol';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';

// Custom Components
import CustomNavbar from '../components/Navbar';
import InventoryList from '../components/InventoryList';
import TaskPanel from '../components/TaskPanel'; 

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
    const [tasks, setTasks] = useState([]);
    const [newVehicleLocation, setNewVehicleLocation] = useState(null);
    const [theVehicle, setTheVehicle] = useState(null);
    
    // Χρήση useEffect για να ανακτήσουμε το χρήστη από το localStorage
    useEffect(() => {
        console.log('Get user location useEffect called');
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('User:', parsedUser);
                var fetchedVehicles = [];
                
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
                            // Αποθήκη
                            console.log(`Fetching base location of admin with admin_id: ${parsedUser.id}`);
                            axios.get(`http://localhost:3000/api/base/baseInfo/${parsedUser.id}`)
                            .then((response) => {
                                console.log(`base location - lat:${response.data.latitude}, long:${response.data.longitude}`);
                                setBase({ id: response.data.id, latitude: response.data.latitude, longitude: response.data.longitude });
                            })
                        }
                        
                        if (parsedUser.is_diasostis) {
                            // Αποθήκη default
                            console.log(`Fetching base location of diasostis`);
                            console.log(`Fetching base location of default base`);
                            axios.get(`http://localhost:3000/api/base/baseInfo/3C7DA85B979211EEA1AC8C1645F10BCD`)
                            .then((response) => {
                                console.log(`base location - lat:${response.data.latitude}, long:${response.data.longitude}`);
                                setBase({ id: response.data.id, latitude: response.data.latitude, longitude: response.data.longitude });
                            })
                        }
                        
                        if (parsedUser.is_admin || parsedUser.is_diasostis) {
                            // Οχήματα
                            console.log(`Fetching vehicles of rescuers`);
                            axios.get(`http://localhost:3000/api/vehicle/all`)
                            .then((response) => {
                                console.log(`Vehicles fetched: ${response.data.length}`);
                                console.log(response.data);
                                setVehicles(response.data);
                                fetchedVehicles = response.data;
                            })
                            
                            // Αιτήματα
                            console.log(`Fetching requests`);
                            axios.get(`http://localhost:3000/api/requests/all`)
                            .then((response) => {
                                console.log(`Requests fetched: ${response.data.length}`);
                                console.log(response.data);
                                setRequests(response.data);
                            })
                            
                            // Προσφορές
                            console.log(`Fetching offers`);
                            axios.get(`http://localhost:3000/api/offers/all`)
                            .then((response) => {
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
    
    useEffect(() => {
        if (user && user.is_diasostis && vehicles) {
            // Πρέπει να δούμε ποια είναι τα δικά του tasks
            console.log('vehicles:', vehicles);
            const myvehicle = vehicles.filter(vehicle => vehicle.owner === user.id);
            console.log('My vehicle:', myvehicle);
            
            // Check if myvehicle is not empty
            if (myvehicle.length > 0) {
                setTheVehicle(myvehicle[0]);
                
                axios.get(`http://localhost:3000/api/users/rescuerTasks/${myvehicle[0].id}`)
                .then(response => {
                    setTasks(response.data);
                    console.log('Tasks:', tasks);
                })
                .catch(error => {
                    console.error('Error fetching tasks:', error);
                })
            } else {
                console.error('No tasks found for this vehicle');
            }
        }
    }, [vehicles, user]);
    
    
    // Handler για την ανάληψη εργασίας από διασωστή
    const handleAssignTask = (task) => {
        //send a request to the server to update the task status
        console.log('Assigning task:', task);
        console.log('User:', user);
        axios.post(`http://localhost:3000/api/users/rescuer/newTask`, {
            taskId: task.id,
            rescuerId: user.id
        })
        .then(
            window.location.reload()
        )
        
    }
    
    // Χρήση useEffect για την αρχική φόρτωση της θέσης του χρήστη στο χάρτη
    const MapWithLocateControl = () => {
        const map = useMap();
        
        useEffect(() => {
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
            {vehicles
                .filter(vehicle => {
                    if (user.is_diasostis) {
                        return vehicle.owner === user.id;
                    }
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
                        },
                        dragend: handleVehicleDragEnd
                    }}
                    
                    draggable={user.is_diasostis ? true : false}
                    >
                    
                    <Popup>
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
                    <h3>{vehicle.username}</h3>
                    <p>ID: {vehicle.id}</p>
                    <h5>Inventory</h5>
                    <InventoryList id={vehicle.id} />
                    {/* <p>Κατάσταση: {vehicle.state}</p> */}
                    </Popup>
                    </Marker>
                ))}
                </>
            );
        }
        
        // Component για να προβάλουμε τους markers των αιτημάτων
        function RequestMarkers() {
            // Check if requests and tasks are loaded
            if (!requests || !tasks) {
                return null; // Or return a loading spinner if you prefer
            }
            
            console.log('Filtered Requests:', requests.filter(request => {
                if (user.is_diasostis) {
                    // Show only unassigned requests or those assigned to the current rescuer
                    if (request.state === 'published' || (request.state === 'pending' && tasks.some(task => task.id === request.id))) {
                        return true;
                    }
                } else {
                    // Show all requests for admin
                    if (filters[toggleOptions.requestsPending] && request.state === 'published') {
                        return true;
                    }
                    if (filters[toggleOptions.requestsAccepted] && request.state !== 'published') {
                        return true;
                    }
                    
                    // Do not show requests that have a state of 'done'
                    if (request.state === 'done') {
                        return false;
                    }
                }
                return false;
            }));
            
            return (
                <>
                <MarkerClusterGroup chunkedLoading>
                {requests
                    .filter(request => {
                        if (user.is_diasostis) {
                            // Show only unassigned requests or those assigned to the current rescuer
                            if (request.state === 'published' || (request.state === 'pending' && tasks.some(task => task.id === request.id))) {
                                return true;
                            }
                        } else {
                            // Show all requests for admin
                            if (filters[toggleOptions.requestsPending] && request.state === 'published') {
                                return true;
                            }
                            if (filters[toggleOptions.requestsAccepted] && request.state !== 'published') {
                                return true;
                            }
                            
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
                        {request.state == 'pending' && (
                            <tr>
                            <td>Κατανομή:</td>
                            <td>{request.accepted_in.split('T')[0]}</td>
                            </tr>)}
                            </tbody>
                            </table>
                            <h5 style={{ marginTop: '10px' }}>Ανάγκες</h5>
                            <InventoryList id={request.id} />
                            {user.is_diasostis && request.state === 'published' && (
                                <Button style={{ marginTop: '5px' }} variant="primary" onClick={() => handleAssignTask(request)}>
                                Ανάληψη Αιτήματος
                                </Button>)}
                                </Popup>
                                </Marker>
                            ))}
                            </MarkerClusterGroup>
                            </>
                        );
                    }
                    
                    // Component για να προβάλουμε τους markers των προσφορών
                    function OfferMarkers() {
                        // Check if requests and tasks are loaded
                        if (!offers || !tasks) {
                            return null; // Or return a loading spinner if you prefer
                        }
                        console.log('Filtered Offers:', offers.filter(offer => {
                            if (user.is_diasostis) {
                                // Show only unassigned offers or those assigned to the current rescuer
                                if (offer.state === 'published' || tasks.some(task => task.id === offer.id)) {
                                    return true;
                                }
                            } else {
                                // Show all offers for admin
                                if (filters[toggleOptions.offersPending] && offer.state === 'published') {
                                    return true;
                                }
                                if (filters[toggleOptions.offersAccepted] && offer.state !== 'published') {
                                    return true;
                                }
                                // Do not show offers that have a state of 'done'
                                if (offer.state === 'done') {
                                    return false;
                                }
                            }
                            return false;
                        }));
                        
                        return (
                            <>
                            <MarkerClusterGroup chunkedLoading>
                            {offers
                                .filter(offer => {
                                    if (user.is_diasostis) {
                                        // Show only unassigned offers or those assigned to the current rescuer
                                        if (offer.state === 'published' || tasks.some(task => task.id === offer.id)) {
                                            return true;
                                        }
                                    } else {
                                        // Show all offers for admin
                                        if (filters[toggleOptions.offersPending] && offer.state === 'published') {
                                            return true;
                                        }
                                        if (filters[toggleOptions.offersAccepted] && offer.state !== 'published') {
                                            return true;
                                        }
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
                                    {offer.state == 'pending' && <tr>
                                        <td>Κατανομή:</td>
                                        <td>{offer.accepted_in.split('T')[0]}</td>
                                        </tr>}
                                        
                                        </tbody>
                                        </table>
                                        <h5 style={{ marginTop: '10px' }}>Δωρεά</h5>
                                        <InventoryList id={offer.id} />
                                        {user.is_diasostis && offer.state === 'published' && (
                                            <Button style={{ marginTop: '5px' }} variant="primary" onClick={() => handleAssignTask(offer)}>
                                            Ανάληψη Προσφοράς
                                            </Button>)}
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
                                
                                // Handler for updating vehicle location
                                const handleConfirmVehicleLocation = async () => {
                                    try {
                                        console.log('Vehicle location before update:', theVehicle);
                                        await axios.post('http://localhost:3000/api/vehicle/updateLocation', {
                                            id: theVehicle.id,
                                            latitude: newVehicleLocation.latitude,
                                            longitude: newVehicleLocation.longitude
                                        });
                                        console.log('Vehicle location updated in the database');
                                        setShowModal(false);
                                        this.forceUpdate()
                                    } catch (error) {
                                        console.error('Error updating vehicle location:', error);
                                    }
                                };
                                
                                const handleBaseDragEnd = (event) => {
                                    const { lat, lng } = event.target.getLatLng();
                                    setNewBaseLocation({ latitude: lat, longitude: lng });
                                    setShowModal(true);
                                };
                                
                                const handleVehicleDragEnd = (event) => {
                                    const { lat, lng } = event.target.getLatLng();
                                    setNewVehicleLocation({ latitude: lat, longitude: lng });
                                    setShowModal(true);
                                };
                                
                                if (!user || !position || !vehicles || !requests.length || !offers.length || !base || !tasks) {
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
                                    name={
                                        toggleOptions.requestsPending}
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
                                        {user.is_admin ? (
                                            <>
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
                                            </>
                                        ) : null}
                                        <Form.Check
                                        type="switch"
                                        id="polylines"
                                        name={toggleOptions.polylines}
                                        label="Γραμμές"
                                        checked={filters.polylines}
                                        onChange={handleToggleChange}
                                        />
                                        </div>
                                        </Form>
                                        </Card.Body>
                                        </Card>
                                        
                                        <div style={{ position: 'relative' }}>
                                        <MapContainer center={position} zoom={13} style={{ height: '84vh' }}>
                                        <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <MapWithLocateControl />
                                        
                                        {/* Εμφάνιση της θέσης της βάσης */}
                                        <Marker position={[base.latitude, base.longitude]} icon={icons.baseIcon} draggable={user.is_admin ? true : false} eventHandlers={{ dragend: handleBaseDragEnd }}>
                                        <Popup>
                                        <h3>Βάση</h3>
                                        <p>Τοποθεσία: {base.latitude}, {base.longitude}</p>
                                        </Popup>
                                        </Marker>
                                        
                                        {/* Εμφάνιση των θέσεων των οχημάτων διασωστών */}
                                        <VehicleMarkers />
                                        
                                        {/* Εμφάνιση της θέσης των αιτημάτων */}
                                        {vehicles.length > 0 && <RequestMarkers />}
                                        
                                        {/* Εμφάνιση της θέσης των προσφορών */}
                                        {vehicles.length > 0 && <OfferMarkers />}
                                        </MapContainer>
                                        
                                        {/* VehiclePanel positioned on top of the map */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            zIndex: 1000,
                                            width: '40%',
                                            maxHeight: 'calc(100vh - 40px)',
                                            overflowY: 'auto',
                                            backgroundColor: 'white',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                            borderRadius: '8px'
                                        }}>
                                        {theVehicle && <TaskPanel tasks={tasks} offers={offers} requests={requests} />}
                                        </div>
                                        </div>
                                        </Container>
                                        
                                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                                        <Modal.Header closeButton>
                                        <Modal.Title>Confirm {user.is_admin ? 'Base' : 'Vehicle'} Location</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                        <p>Are you sure you want to update the base location to:</p>
                                        <p>Latitude: {user.is_admin ? newBaseLocation?.latitude : newVehicleLocation?.latitude}</p>
                                        <p>Longitude: {user.is_admin ? newBaseLocation?.longitude : newVehicleLocation?.longitude}</p>
                                        </Modal.Body>
                                        <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        Cancel
                                        </Button>
                                        <Button variant="primary" onClick={user.is_admin ? handleConfirmBaseLocation : handleConfirmVehicleLocation}>
                                        Confirm
                                        </Button>
                                        </Modal.Footer>
                                        </Modal>
                                        </>
                                    );
                                };
                                
                                export default MapPage;
                                