import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [show, setShow] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ text: '' });
  const [selectedProducts, setSelectedProducts] = useState([{ product: '', quantity: 1 }]);
  const [products, setProducts] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAnnouncements();
    fetchProducts();
  }, []);
  
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/announcements/all');
      console.log('ANNOUNCEMENTS');
      console.log(response.data);
      setAnnouncements(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };
  
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/product/all');
      console.log('PRODUCTS');
      console.log(response.data);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  
  const handleSave = async () => {
    console.log('Saving announcement:', newAnnouncement);
    console.log('Selected products:', selectedProducts);
    try {
      await axios.post('http://localhost:3000/api/announcements/new', {
        text: newAnnouncement.text,
        products: selectedProducts
      });
      fetchAnnouncements();
      handleClose();
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };
  
  const handleProductChange = (index, field, value) => {
    const updatedProducts = selectedProducts.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    );
    setSelectedProducts(updatedProducts);
  };

  const addProductField = () => {
    setSelectedProducts([...selectedProducts, { product: '', quantity: 1 }]);
  };

  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name
  }));

  if (!announcements) return <div>Loading...</div>;
  
  return (
    <>
      <CustomNavbar user={user} />
      <Container>
        <Row className="my-4">
          <Col>
            <h2>Διαχείριση Ανακοινώσεων</h2>
            <Button variant="primary" onClick={handleShow}>Δημιουργία Νέας Ανακοίνωσης</Button>
          </Col>
        </Row>
        <Row>
          <Col>
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
                  <tr key={announcement.id}>
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
        
        {/* Modal for creating new announcements */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Δημιουργία Νέας Ανακοίνωσης</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="announcementText">
                <Form.Label>Κείμενο Ανακοίνωσης</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Εισάγετε το κείμενο της ανακοίνωσης"
                  value={newAnnouncement.text}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="announcementProducts">
                <Form.Label>Προϊόντα</Form.Label>
                {selectedProducts.map((selectedProduct, index) => (
                  <div key={index} className="d-flex mb-2">
                    <div className="flex-grow-1 mr-2">
                      <Select
                        options={productOptions}
                        value={productOptions.find(option => option.value === selectedProduct.product)}
                        onChange={(selectedOption) => handleProductChange(index, 'product', selectedOption.value)}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <Form.Control
                        type="number"
                        value={selectedProduct.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                ))}
                <Button variant="secondary" onClick={addProductField}>+</Button>
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

export default AnnouncementManager;
