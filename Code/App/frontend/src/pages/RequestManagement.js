import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import CustomNavbar from '../components/Navbar';

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ user: null, product: null, quantity: 1 });
  const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category

  // Get the user from the state passed from the login page
  const user = JSON.parse(localStorage.getItem('user'));

  // Sort requests by date_in and ensure 'done' requests are last
  const sortRequests = (requests) => {
    return requests.sort((a, b) => {
      if (a.state === 'done' && b.state !== 'done') return 1;
      if (a.state !== 'done' && b.state === 'done') return -1;
      return new Date(a.date_in) - new Date(b.date_in);
    });
  };

  // Fetch requests, products, and categories from the backend
  useEffect(() => {
    axios.get('http://localhost:3000/api/requests/user/' + user.id)
      .then(response => {
        const sortedRequests = sortRequests(response.data);
        console.log('Fetched and sorted requests:', sortedRequests); // Log the fetched requests
        setRequests(sortedRequests);
      })
      .catch(error => console.error('Error fetching requests:', error));

    axios.get('http://localhost:3000/api/product/all')
      .then(response => {
        setProducts(response.data);
        console.log('Fetched products:', response.data); // Log the fetched products
        setFilteredProducts(response.data); // Initialize filtered products with all products
      })
      .catch(error => console.error('Error fetching products:', error));

    axios.get('http://localhost:3000/api/product/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddRequest = () => {
    axios.post('http://localhost:3000/api/requests/create', 
      {
        user: user.id,
        products: [
          {
            product: newRequest.product,
            quantity: newRequest.quantity
          }
        ]
      }
    )
    .then(() => {
      closeModal();
      window.location.reload();
    })
    .catch(error => console.error('Error adding request:', error));
  };

  const handleDeleteRequest = (requestId) => {
    axios.delete(`http://localhost:3000/api/requests/delete/${requestId}`) 
      .then(() => {
        setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      })
      .catch(error => console.error('Error deleting request:', error));
  };

  const handleCategoryChange = (selectedOption) => {
    console.log('Selected category:', selectedOption);
    setSelectedCategory(selectedOption); // Update the selected category state
    if (selectedOption) {
      setFilteredProducts(products.filter(product => product.categoryId === selectedOption));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <>
      <CustomNavbar user={user} />
      <Container>
        <h1>Διαχείριση Αιτημάτων</h1>
        <Button variant="primary" style={{ float: 'right', marginBottom: '10px' }} onClick={openModal}>
          +
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Προϊόν</th>
              <th>Πλήθος Ατόμων</th>
              <th>Κατάσταση</th>
              <th>Καταχώρηση</th>
              <th>Ανάληψη</th>
              <th>Ολοκλήρωση</th>
              <th>Ενέργειες</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.products[0].name}</td>
                <td>{request.products[0].quantity}</td>
                <td>{request.state}</td>
                <td>{request.date_in?.split('T')[0]}</td>
                <td>{request.accepted_in?.split('T')[0]}</td>
                <td>{request.date_out?.split('T')[0]}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteRequest(request.id)}>Διαγραφή</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for adding new request */}
        <Modal show={modalIsOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Προσθήκη Νέου Αιτήματος</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Κατηγορία</Form.Label>
                <Select
                  options={categories.map(category => ({ value: category.id, label: category.name }))}
                  onChange={selectedCategory => handleCategoryChange(selectedCategory?.value)}
                  isClearable
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Προϊόν</Form.Label>
                <Select
                  options={filteredProducts.map(product => ({ value: product.id, label: product.name }))}
                  onChange={selectedOption => setNewRequest({ ...newRequest, product: selectedOption.value })}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Πλήθος Ατόμων</Form.Label>
                <Form.Control
                  type="number"
                  value={newRequest.quantity}
                  onChange={e => setNewRequest({ ...newRequest, quantity: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Κλείσιμο</Button>
            <Button variant="primary" onClick={handleAddRequest}>Προσθήκη</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default RequestManagement;
