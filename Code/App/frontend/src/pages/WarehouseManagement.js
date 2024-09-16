import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Tabs, Tab, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';
import PopupForm from '../components/NewProductForm';

const WarehouseManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0 });
  const [itemModalIsOpen, setItemModalIsOpen] = useState(false);

  // Εμφάνιση του modal για την προσθήκη νέου προϊόντος
  const openItemModal = () => {
    setItemModalIsOpen(true);
  };
  // Κλείσιμο του modal για την προσθήκη νέου προϊόντος
  const closeItemModal = () => {
    setItemModalIsOpen(false);
  };
  
  //Ανάκτηση του χρήστη από το localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  useEffect(() => {
    // Ανάκτηση των προϊόντων από το backend
    axios.get('http://localhost:3000/api/warehouse')
    .then(response => {
      setProducts(response.data);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };
  
  const handleAddProduct = () => {
    axios.post('http://localhost:3000/api/warehouse', newProduct)
    .then(response => {
      setProducts([...products, response.data]);
      setNewProduct({ name: '', quantity: 0 });
    })
    .catch(error => {
      console.error('Error adding product:', error);
    });
  };
  
  const handleDeleteProduct = (productId) => {
    axios.delete(`http://localhost:3000/api/warehouse/${productId}`)
    .then(() => {
      setProducts(products.filter(product => product.id !== productId));
    })
    .catch(error => {
      console.error('Error deleting product:', error);
    });
  };
  
  return (
    <>
    <CustomNavbar user={user} />
    <Container>
      <Tabs defaultActiveKey="interest" id="warehouse-tabs">
        <Tab eventKey="interest" title="Γενικά">
        <h1 style={{ marginTop: '20px' }}>Γενικά</h1>
          <Row style={{ marginTop: '20px' }}>
            
            <Col md={8}>
              <h2>Προϊόντα Ενδιαφέροντος
                <button 
                  style={{ float: 'right', marginLeft: '10px' }}
                  className="btn btn-primary" 
                  onClick={openItemModal}> + </button>
              </h2>
              <PopupForm isOpen={itemModalIsOpen} onClose={closeItemModal} />
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Όνομα Προϊόντος</th>
                    <th>Λεπτομέρειες</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Button variant="edit" onClick={() => handleEditProduct(product.id)}>Επεξεργασία</Button>
                        <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Διαγραφή</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col md={4}>
              <h2>Διαθέσιμες κατηγορίες
              <button 
                  style= {{ float: 'right', marginLeft: '10px' }}
                  className="btn btn-primary" 
                  onClick={openItemModal}> + </button>
              </h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Αριθμός</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(10).keys()].map(num => (
                    <tr key={num + 1}>
                      <td>{num + 1}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="warehouse" title="Προϊόντα Εντός Αποθήκης">
          <h1 style={{ marginTop: '20px' }}
          >Προϊόντα Εντός Αποθήκης</h1>
          <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Όνομα Προϊόντος</th>
                    <th>Λεπτομέρειες</th>
                    <th>Ενέργειες</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Button variant="edit" onClick={() => handleEditProduct(product.id)}>Επεξεργασία</Button>
                        <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Διαγραφή</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
        </Tab>
        <Tab eventKey="stock" title="Κατάσταση">
          <h1 style={{ marginTop: '20px' }}>Κατάσταση</h1>
          <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Όνομα Προϊόντος</th>
                    <th>Λεπτομέρειες</th>
                    <th>Τοποθεσία</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <Button variant="edit" onClick={() => handleEditProduct(product.id)}>Επεξεργασία</Button>
                        <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Διαγραφή</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
        </Tab>
      </Tabs>
    </Container>
    </>
  );
};

export default WarehouseManagement;
