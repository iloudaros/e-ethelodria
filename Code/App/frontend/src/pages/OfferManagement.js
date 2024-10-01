import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';

const CitizenOfferManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [newOffer, setNewOffer] = useState({ announcementId: '', products: [{ product: '', quantity: 1 }] });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    fetchAnnouncements();
    fetchOffers();
    fetchProducts();
  }, []);
  
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/announcements/all');
      setAnnouncements(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
  
  const fetchOffers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/offers/user/${user.id}`);
      setOffers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/all');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const handleShow = (announcement = null) => {
    if (announcement) {
      setSelectedAnnouncement(announcement);
      const announcementProducts = announcement.productList.map(p => ({
        product: p.product,
        quantity: p.quantity, // Προσυμπλήρωση της ποσότητας που ζητάει η ανακοίνωση
        maxQuantity: p.quantity,
        name: p.name
      }));
      setNewOffer({ announcementId: announcement.id, products: announcementProducts });
    }
    setShow(true);
  };
  
  const handleClose = () => {
    setShow(false);
    setSelectedAnnouncement(null);
    setNewOffer({ announcementId: '', products: [{ product: '', quantity: 1 }] });
  };
  
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:3000/api/offers/create', {
        user: user.id,
        products: newOffer.products.map(p => ({ product: p.product, quantity: p.quantity }))
      });
      fetchOffers();
      handleClose();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };
  
  const handleDeleteOffer = async (offerId) => {
    try {
      console.log('Deleting offer with ID:', offerId);
      await axios.delete(`http://localhost:3000/api/offers/delete/${offerId}`);
      fetchOffers();
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };
  
  
  const handleProductChange = (index, field, value) => {
    const updatedProducts = newOffer.products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
  );
  setNewOffer({ ...newOffer, products: updatedProducts });
};

const productOptions = (selectedAnnouncement ? selectedAnnouncement.productList : products).map(product => ({
  value: product.product || product.id,
  label: product.name
}));

return (
  <>
  <CustomNavbar user={user} />
  <Container>
  <Row className="my-4">
  <Col>
  <h2>Διαχείριση Προσφορών</h2>
  </Col>
  </Row>
  <Row>
  <Col>
  <h3>Ανακοινώσεις</h3>
  <Table striped bordered hover>
  <thead>
  <tr>
  <th>Ημερομηνία Δημοσίευσης</th>
  <th>Κείμενο</th>
  <th>Προϊόντα</th>
  </tr>
  </thead>
  <tbody>
  {announcements.map(announcement => (
    <tr key={announcement.id} onClick={() => handleShow(announcement)}>
    <td>{announcement.published_in.split('T')[0]}</td>
    <td>{announcement.text}</td>
    <td>
    <ul>
    {announcement.productList.map(product => (
      <li key={product.product}>{product.name} - {product.quantity}</li>
    ))}
    </ul>
    </td>
    </tr>
  ))}
  </tbody>
  </Table>
  </Col>
  </Row>
  <Row>
  <Col>
  <h3>Οι Προσφορές Μου</h3>
  <Table striped bordered hover>
  <thead>
  <tr>
  <th>Προϊόντα</th>
  <th>Κατάσταση</th>
  <th>Ημερομηνία Υποβολής</th>
  <th>Ενέργειες</th>
  </tr>
  </thead>
  <tbody>
  {offers.map(offer => (
    <tr key={offer.id}>
    <td>
    <ul>
    {offer.products.map(product => (
      <li key={product.product}>{product.name} - {product.quantity}</li>
    ))}
    </ul>
    </td>
    <td>{offer.state}</td>
    <td>{offer.date_in.split('T')[0]}</td>
    <td>
    {offer.state === 'published' && (
      <Button variant="danger" onClick={() => handleDeleteOffer(offer.id)}>Ακύρωση</Button>
    )}
    </td>
    </tr>
  ))}
  </tbody>
  </Table>
  </Col>
  </Row>
  
  {/* Modal for creating new offers */}
  <Modal show={show} onHide={handleClose}>
  <Modal.Header closeButton>
  <Modal.Title>Υποβολή Νέας Προσφοράς</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <Form>
  <Form.Group controlId="offerProducts">
  <Form.Label>Προϊόντα</Form.Label>
  {newOffer.products.map((selectedProduct, index) => (
    <div key={index} className="d-flex mb-2">
    <div className="flex-grow-1 mr-2">
    <Select
    options={productOptions}
    value={productOptions.find(option => option.value === selectedProduct.product)}
    onChange={(selectedOption) => handleProductChange(index, 'product', selectedOption.value)}
    isDisabled={!!selectedAnnouncement}
    />
    </div>
    <div className="flex-shrink-0">
    <Form.Control
    type="number"
    value={selectedProduct.quantity}
    onChange={(e) => handleProductChange(index, 'quantity', Math.min(e.target.value, selectedProduct.maxQuantity))}
    min="1"
    max={selectedProduct.maxQuantity}
    />
    </div>
    </div>
  ))}
  </Form.Group>
  </Form>
  </Modal.Body>
  <Modal.Footer>
  <Button variant="secondary" onClick={handleClose}>Ακύρωση</Button>
  <Button variant="primary" onClick={handleSave}>Αποθήκευση</Button>
  </Modal.Footer>
  </Modal>
  </Container>
  </>
);
};

export default CitizenOfferManager;
