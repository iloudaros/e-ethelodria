import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const Vehicle = () => {
  const [vehicle, setVehicle] = useState(null);
  const [baseInventory, setBaseInventory] = useState([]);
  const [bases, setBases] = useState([]);
  const [loadModalIsOpen, setLoadModalIsOpen] = useState(false);
  const [unloadModalIsOpen, setUnloadModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState(1);
  const [nearbyBase, setNearbyBase] = useState(null);

  

 //Ανάκτηση του χρήστη από το localStorage
 const storedUser = localStorage.getItem('user');
 const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch data
  useEffect(() => {
    
    fetchVehicle();
    fetchBases();
    
  }, []);
  
  const fetchVehicle = () => {
    axios.get(`http://localhost:3000/api/vehicle/single/${user.id}`)
      .then(response => {
        setVehicle(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error fetching vehicle cargo:', error);
      });
  };
  
  const fetchBases = () => {
    axios.get('http://localhost:3000/api/base/all')
      .then(response => {
        setBases(response.data);
        checkProximity(response.data);
      })
      .catch(error => {
        console.error('Error fetching bases:', error);
      });
  };
  
  const checkProximity = (bases) => {
    // Assuming we have the rescuer's current location
    const rescuerLocation = { latitude: 39.366995, longitude: 22.950558 };
    
    for (let base of bases) {
      const distance = calculateDistance(
        rescuerLocation.latitude,
        rescuerLocation.longitude,
        base.latitude,
        base.longitude
      );
      
      if (distance <= 100) {
        setNearbyBase(base);
        fetchBaseInventory(base.id);
        return;
      }
    }
    
    setNearbyBase(null); // If no base is within 100 meters
  };
  
  const fetchBaseInventory = (baseId) => {
    axios.get(`http://localhost:3000/api/base/${baseId}/inventory`)
      .then(response => {
        setBaseInventory(response.data);
      })
      .catch(error => {
        console.error('Error fetching base inventory:', error);
      });
  };
  
  // Modal Handling
  const openLoadModal = (product) => {
    setSelectedProduct(product);
    setAmount(1);
    setLoadModalIsOpen(true);
  };
  
  const closeLoadModal = () => {
    setLoadModalIsOpen(false);
  };
  
  const openUnloadModal = (product) => {
    setSelectedProduct(product);
    setAmount(1);
    setUnloadModalIsOpen(true);
  };
  
  const closeUnloadModal = () => {
    setUnloadModalIsOpen(false);
  };
  
  // Load and Unload Actions
  const handleLoadProduct = () => {
    const productId = selectedProduct.id;
    const loadAmount = parseInt(amount);
    
    if (isNaN(loadAmount) || loadAmount <= 0 || loadAmount > selectedProduct.quantity) {
      alert('Invalid load amount');
      return;
    }
    
    axios.put('http://localhost:3000/api/vehicle/load', { productId, amount: loadAmount })
      .then(() => {
        fetchVehicle();
        fetchBaseInventory(nearbyBase.id);
        closeLoadModal();
      })
      .catch(error => {
        console.error('Error loading product:', error);
      });
  };
  
  const handleUnloadProduct = () => {
    const productId = selectedProduct.id;
    const unloadAmount = parseInt(amount);
    
    if (isNaN(unloadAmount) || unloadAmount <= 0 || unloadAmount > selectedProduct.quantity) {
      alert('Invalid unload amount');
      return;
    }
    
    axios.put('http://localhost:3000/api/vehicle/unload', { productId, amount: unloadAmount })
      .then(() => {
        fetchVehicle();
        fetchBaseInventory(nearbyBase.id);
        closeUnloadModal();
      })
      .catch(error => {
        console.error('Error unloading product:', error);
      });
  };
  

  if (!vehicle) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomNavbar user={user} />
      <Container>
        <h1 style={{ marginTop: '20px' }}>Διαχείριση Φορτίου Οχήματος</h1>
        
        <h2>Φορτίο Οχήματος</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Όνομα Προϊόντος</th>
              <th>Ποσότητα</th>
              <th>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {vehicle.inventory.map(product => (
              <tr key={product.id}>
                <td>{product.product}</td>
                <td>{product.quantity}</td>
                <td>
                  <Button variant="info" onClick={() => openUnloadModal(product)}>Εκφόρτωση</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {nearbyBase ? (
          <>
            <h2>Αποθήκη: {nearbyBase.name}</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Όνομα Προϊόντος</th>
                  <th>Ποσότητα</th>
                  <th>Ενέργειες</th>
                </tr>
              </thead>
              <tbody>
                {baseInventory.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <Button variant="info" onClick={() => openLoadModal(product)}>Φόρτωση</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ):'No base was found within 100 meters.'}
        
        {/* Load Modal */}
        <Modal show={loadModalIsOpen} onHide={closeLoadModal}>
          <Modal.Header closeButton>
            <Modal.Title>Φόρτωση Προϊόντος</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAmount">
                <Form.Label>Ποσότητα</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={selectedProduct ? selectedProduct.quantity : 1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeLoadModal}>Κλείσιμο</Button>
            <Button variant="primary" onClick={handleLoadProduct}>Φόρτωση</Button>
          </Modal.Footer>
        </Modal>
        
        {/* Unload Modal */}
        <Modal show={unloadModalIsOpen} onHide={closeUnloadModal}>
          <Modal.Header closeButton>
            <Modal.Title>Εκφόρτωση Προϊόντος</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAmount">
                <Form.Label>Ποσότητα</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={selectedProduct ? selectedProduct.quantity : 1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeUnloadModal}>Κλείσιμο</Button>
            <Button variant="primary" onClick={handleUnloadProduct}>Εκφόρτωση</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Vehicle;
