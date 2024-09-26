import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';
import doubleArrow from '../assets/double_arrow.png';
import { BoxArrowInDown, BoxArrowInUp, Truck } from 'react-bootstrap-icons';

// Helper function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Convert degrees to radians
  function toRadians(degrees) {
      return degrees * (Math.PI / 180);
  }

  // Convert input coordinates from degrees to radians
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = 6371 * c; // Earth's radius in km

  return distance * 1000; // Convert to meters
}

const Vehicle = () => {
  const [vehicle, setVehicle] = useState(null);
  const [baseInventory, setBaseInventory] = useState([]);
  const [bases, setBases] = useState([]);
  const [loadModalIsOpen, setLoadModalIsOpen] = useState(false);
  const [unloadModalIsOpen, setUnloadModalIsOpen] = useState(false);
  const [deliveryModalIsOpen, setDeliveryModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState(1);
  const [nearbyBase, setNearbyBase] = useState(null);

  // Retrieve user from localStorage
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
        console.log('Bases:', response.data);
        console.log(response.data);
        checkProximity(response.data);
      })
      .catch(error => {
        console.error('Error fetching bases:', error);
      });
  };
  
  const checkProximity = (bases) => {
    // Assuming we have the rescuer's current location
    const rescuerLocation = {
      latitude: user.latitude,
      longitude: user.longitude
    };
    
    console.log('Rescuer Location:', rescuerLocation);

    for (let base of bases) {
      const distance = calculateDistance(
        rescuerLocation.latitude,
        rescuerLocation.longitude,
        base.latitude,
        base.longitude
      );
      console.log('Distance to base:', distance);
      
      if (distance <= 3000) {
        console.log('Base within 100 meters:', base);
        setNearbyBase(base);
        fetchBaseInventory(base.id);
        return;
      }
    }
    
    setNearbyBase(null); // If no base is within 100 meters
  };
  
  const fetchBaseInventory = (baseId) => {
    axios.get(`http://localhost:3000/api/inventory/single/${baseId}`)
      .then(response => {
        setBaseInventory(response.data);
        console.log('Base Inventory:', response.data);
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
    if (!nearbyBase) {
      alert('No nearby base found. Cannot unload product.');
      return;
    }
    setSelectedProduct(product);
    console.log('Selected Product:', selectedProduct);
    setAmount(1);
    setUnloadModalIsOpen(true);
  };
  
  const closeUnloadModal = () => {
    setUnloadModalIsOpen(false);
  };

  const openDeliveryModal = (product) => {
    setSelectedProduct(product);
    setAmount(1);
    setDeliveryModalIsOpen(true);
  };

  const closeDeliveryModal = () => {
    setDeliveryModalIsOpen(false);
  };

  // Load, Unload, and Delivery Actions
  const handleLoadProduct = () => {
    const productId = selectedProduct.product;
    const loadAmount = parseInt(amount);
    
    console.log('Loading product:', productId, 'Amount:', loadAmount);

    if (isNaN(loadAmount) || loadAmount <= 0 || loadAmount > selectedProduct.quantity) {
      alert('Invalid load amount');
      return;
    }
    
    axios.put('http://localhost:3000/api/inventory/move', {
      sender: nearbyBase.id ,
      receiver: vehicle.id,
      productId: productId,
      amount: loadAmount
    })
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
    console.log('Unloading product:', productId, 'Amount:', unloadAmount);
    if (isNaN(unloadAmount) || unloadAmount <= 0 || unloadAmount > selectedProduct.quantity) {
      alert('Invalid unload amount');
      return;
    }
    
    axios.put('http://localhost:3000/api/inventory/move', {
      sender: vehicle.id ,
      receiver: nearbyBase.id,
      productId: productId,
      amount: unloadAmount
    })
      .then(() => {
        fetchVehicle();
        fetchBaseInventory(nearbyBase.id);
        closeUnloadModal();
      })
      .catch(error => {
        console.error('Error unloading product:', error);
      });
  };

  const handleDeliverProduct = () => {
    const productId = selectedProduct.id;
    const deliverAmount = parseInt(amount);

    if (isNaN(deliverAmount) || deliverAmount <= 0 || deliverAmount > selectedProduct.quantity) {
      alert('Invalid delivery amount');
      return;
    }

    axios.put(`http://localhost:3000/api/inventory/update`, {
      id: vehicle.id,
      productId: productId,
      quantity: deliverAmount,

    })
      .then(() => {
        fetchVehicle();
        fetchBaseInventory(nearbyBase.id);
        closeDeliveryModal();
      })
      .catch(error => {
        console.error('Error delivering product:', error);
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
        
        <Row>
          <Col>
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
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <Button variant="info" onClick={() => openUnloadModal(product)}>
                        <BoxArrowInDown style={{color: 'white'}}/>
                      </Button>
                      <Button variant="danger" onClick={() => openDeliveryModal(product)} style={{ marginLeft: '10px' }}>
                        <Truck style={{color: 'white'}}/>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
          
          <Col md="auto" className="d-flex align-items-center">
            <img src={doubleArrow} alt="Double Arrow" className="d-none d-lg-block" style={{ width: '100px', height: '100px' }} />
          </Col>
          
          <Col>
            {nearbyBase ? (
              <>
                <h2>Αποθήκη {nearbyBase.name}</h2>
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
                      <tr key={product.product}>
                        <td>{product.name}</td>
                        <td>{product.quantity}</td>
                        <td>
                          <Button variant="info" onClick={() => openLoadModal(product)}>
                            <BoxArrowInUp style={{color: 'white'}} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            ) : 'No base was found within 100 meters.'}
          </Col>
        </Row>
        
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

        {/* Delivery Modal */}
        <Modal show={deliveryModalIsOpen} onHide={closeDeliveryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Παράδοση Προϊόντος</Modal.Title>
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
            <Button variant="secondary" onClick={closeDeliveryModal}>Κλείσιμο</Button>
            <Button variant="primary" onClick={handleDeliverProduct}>Παράδοση</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default Vehicle;
