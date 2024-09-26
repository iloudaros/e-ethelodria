import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [show, setShow] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAnnouncements();
    fetchProducts();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      await axios.post('/api/announcements', {
        text: newAnnouncement,
        products: selectedProducts
      });
      fetchAnnouncements();
      handleClose();
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleProductChange = (productId, event) => {
    const quantity = event.target.value;
    setSelectedProducts(prevState => {
      const existingProduct = prevState.find(p => p.id === productId);
      if (existingProduct) {
        return prevState.map(p => p.id === productId ? { ...p, quantity } : p);
      } else {
        return [...prevState, { id: productId, quantity }];
      }
    });
  };

  return (
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
                  <td>{announcement.published_in}</td>
                  <td>{announcement.text}</td>
                  <td>
                    <ul>
                      {announcement.products.map(product => (
                        <li key={product.id}>{product.name} - {product.quantity}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

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
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="announcementProducts">
              <Form.Label>Προϊόντα</Form.Label>
              {products.map(product => (
                <Form.Row key={product.id} className="align-items-center">
                  <Col xs="6">
                    <Form.Control plaintext readOnly defaultValue={product.name} />
                  </Col>
                  <Col xs="6">
                    <Form.Control
                      type="number"
                      placeholder="Ποσότητα"
                      onChange={(e) => handleProductChange(product.id, e)}
                    />
                  </Col>
                </Form.Row>
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
  );
};

export default AnnouncementManager;
