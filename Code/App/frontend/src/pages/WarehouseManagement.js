import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';

const WarehouseManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0 });

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
      <CustomNavbar />
      <Container>
        <h1>Διαχείριση Αποθήκης</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Όνομα Προϊόντος</th>
              <th>Ποσότητα</th>
              <th>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Διαγραφή</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <h2>Προσθήκη Νέου Προϊόντος</h2>
        <Form>
          <Form.Group controlId="formProductName">
            <Form.Label>Όνομα Προϊόντος</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Εισάγετε το όνομα του προϊόντος"
            />
          </Form.Group>
          <Form.Group controlId="formProductQuantity">
            <Form.Label>Ποσότητα</Form.Label>
            <Form.Control
              type="number"
             value={newProduct.quantity}
              onChange={handleInputChange}
              placeholder="Εισάγετε την ποσότητα"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAddProduct}>
            Προσθήκη Προϊόντος
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default WarehouseManagement;
