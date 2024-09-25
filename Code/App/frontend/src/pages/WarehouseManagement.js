import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Tabs, Tab, Row, Col, Modal, Form } from 'react-bootstrap';
import { Pencil, Trash, Upload, Download, Send, ArrowReturnLeft } from 'react-bootstrap-icons';

import axios from 'axios';

import CustomNavbar from '../components/Navbar';
import ProductForm from '../components/ProductForm';
import CategoryForm from '../components/CategoryForm';

import validate from '../services/validate';

const WarehouseManagement = () => {
  const [categories, setCategories] = useState([]);
  const [categoryToEdit, setCategoryToEdit] = useState({});
  const [products, setProducts] = useState([]);
  const [productToEdit, setProductToEdit] = useState({});
  const [inventory, setInventory] = useState({});
  const [itemModalIsOpen, setItemModalIsOpen] = useState(false);
  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);
  const [fileModalIsOpen, setFileModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  
  // State variables for the modal in "Προϊόντα Εντός Αποθήκης"
  const [warehouseModalIsOpen, setWarehouseModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [amount, setAmount] = useState(1);
  const [sender, setSender] = useState('');
  const [destination, setDestination] = useState('');
  
  // State variables for the modal in "Κατάσταση"
  const [returnModalIsOpen, setReturnModalIsOpen] = useState(false);
  
  // New state variable for selected category filter
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  //Ανάκτηση του χρήστη από το localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // Modal Handling
  // Εμφάνιση του modal για την προσθήκη νέου προϊόντος
  const openItemModal = () => {
    setItemModalIsOpen(true);
  };
  // Κλείσιμο του modal για την προσθήκη νέου προϊόντος
  const closeItemModal = () => {
    setItemModalIsOpen(false);
  };
  
  // Εμφάνιση του modal για την επιλογή αρχείου
  const openFileModal = () => {
    setFileModalIsOpen(true);
  };
  // Κλείσιμο του modal για την επιλογή αρχείου
  const closeFileModal = () => {
    setFileModalIsOpen(false);
  };
  
  // Εμφάνιση του modal για προσθήκη νέας κατηγορίας
  const openCategoryModal = () => {
    setCategoryModalIsOpen(true);
  };
  // Κλείσιμο του modal για την προσθήκη νέου προϊόντος
  const closeCategoryModal = () => {
    setCategoryModalIsOpen(false);
  };
  
  //  Modal handling for moving products
  const openWarehouseModal = (product) => {
    setSelectedProduct(product);
    setAmount(1);
    setSender('Αποθήκη');
    setDestination('');
    setWarehouseModalIsOpen(true);
  };
  
  const closeWarehouseModal = () => {
    setWarehouseModalIsOpen(false);
  };
  
  
  // Modal handling for returning products
  const openReturnModal = (product) => {
    setSelectedProduct(product);
    setAmount(1);
    setSender(product.id);
    setDestination('Αποθήκη');
    setReturnModalIsOpen(true);
  };
  const closeRetrurnModal = () => {
    setReturnModalIsOpen(false);
  };
  
  
  // Category Handling
  const handleAddCategory = (category) => {
    const emptyCategory = { id: '', name: '' };
    setCategoryToEdit(emptyCategory);
    console.log("Updated categoryToEdit:", categoryToEdit);
    openCategoryModal();
  };
  
  const handleEditCategory = (categoryId) => {
    const categoryOfInterest = categories.find(category => category.id === categoryId);
    console.log("Updated categoryOfInterest:", categoryOfInterest);
    setCategoryToEdit(categoryOfInterest);
    openCategoryModal();
    
  };
  
  const handleDeleteCategory = (categoryId) => {
    axios.delete(`http://localhost:3000/api/product/category/delete/${categoryId}`)
    .then(() => {
      setCategories(categories.filter(category => category.id !== categoryId));
    })
    .catch(error => {
      console.error('Error deleting category:', error);
    });
  };
  
  // Product Handling
  const handleAddProduct = (product) => {
    const emptyProduct = { name: '', category: '', details: {} };
    setProductToEdit(emptyProduct);
    console.log("Updated productToEdit:", productToEdit);
    openItemModal();
  };
  
  const handleEditProduct = (productId) => {
    const productofinterest = products.find(product => product.id === productId);
    console.log("Updated productToEdit:", productofinterest);
    setProductToEdit(productofinterest);
    openItemModal();
  };
  
  const handleDeleteProduct = (productId) => {
    axios.delete(`http://localhost:3000/api/product/delete/${productId}`)
    .then(() => {
      setProducts(products.filter(product => product.id !== productId));
    })
    .catch(error => {
      console.error('Error deleting product:', error);
    });
  };
  
  
  
  // Inventory Handling
  const handleQuantityChange = (id, productId, quantity) => {
    // Return if the quantity is empty
    if (quantity === '') {
      alert('Please enter a quantity.');
      return;
    }
    
    // Check if the quantity is a positive integer
    if (quantity <= 0 ) {
      alert('Please enter a positive integer for the quantity.');
      return;
    }
    // Send a PUT request to the server to update the quantity of the product
    axios.put(`http://localhost:3000/api/inventory/update`, {
      id: id,
      productId: productId,
      quantity: quantity
    })
    .then(() => {
      // Update the inventory state after the move is successful
      axios.get('http://localhost:3000/api/inventory/all')
      .then(response => {
        setInventory(response.data);
        closeWarehouseModal();
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
    })    
  };
  
  // Moving products. It sends a PUT request with the sender, the receiver, the productId, and the amount. Then it updates the inventory state.
  const handleMoveProduct = () => {
    const currentSender = sender; // Avoid shadowing by renaming
    const currentReceiver = destination;
    const productId = selectedProduct?.productId; // Use optional chaining to avoid errors
    const moveAmount = parseInt(amount);
    
    // Check if all required variables are initialized
    if (!productId || !currentReceiver || !moveAmount) {
      console.error('Missing required data for moving product');
      return;
    }
    
    // Check if the move amount is a positive integer and smaller than the current inventory
    if (isNaN(moveAmount) || moveAmount <= 0 || moveAmount > selectedProduct.quantity) {
      console.error('Invalid move amount');
      alert('Invalid move amount');
      return;
    }
    
    
    // Log the values before making the PUT request
    console.log('Sender:', currentSender);
    console.log('Receiver:', currentReceiver);
    console.log('Product ID:', productId);
    console.log('Amount:', moveAmount);
    
    axios.put('http://localhost:3000/api/inventory/move', { sender: currentSender, receiver: currentReceiver, productId, amount: moveAmount })
    .then(() => {
      // Update the inventory state after the move is successful
      axios.get('http://localhost:3000/api/inventory/all')
      .then(response => {
        setInventory(response.data);
        closeWarehouseModal();
        closeRetrurnModal();
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
      });
    })
    .catch(error => {
      console.error('Error moving product:', error);
    });
  };
  
  
  
  
  // JSON Loading for importing products and categories
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  // Let the user upload a JSON file with products and categories
  const handleFileUpload = () => {
    
    if (!selectedFile) {
      console.error('No file selected.');
      alert('Please select a file before uploading.');
      return;
    }
    
    console.log('Selected file:', selectedFile);
    
    // Make sure the file is a JSON file, validate it and then create a json object from it
    var jsonData;
    const reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.onload = () => {
      try {
        jsonData = JSON.parse(reader.result);
        console.log('Parsed JSON data:', jsonData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file. Please check the console for details.');
        return;
      }
      
      // Validate the JSON data
      const validated = validate(jsonData);
      if (!validated) {
        console.error('Invalid JSON data');
        alert('Invalid JSON data');
        return;
      }
      
      // If the JSON data is valid, upload it to the server
      axios.post('http://localhost:3000/api/product/uploadJSON', jsonData)
      .then(response => {
        console.log('File uploaded successfully:', response.data);
        closeFileModal();
        alert('File uploaded successfully.');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
    };
  };
  
  // Signal the server to sync with CEID JSON file
  const syncWithCEID = () => {
    axios.post('http://localhost:3000/api/product/syncWithCeid')
    .then(response => {
      console.log('Latest version of CEID JSON was imported.', response.data);
      alert('Latest version of CEID JSON was imported.');
      window.location.reload();
    })
    .catch(error => {
      console.error('Error downloading JSON:', error);
    });
  };
  
  useEffect(() => {
    // Ανάκτηση των προϊόντων από το backend
    axios.get('http://localhost:3000/api/product/all')
    .then(response => {
      console.log(response.data.slice(0, 3));
      setProducts(response.data);
    })
    .catch(error => {
      console.error('Error fetching products:', error);
    });
    
    // Ανάκτηση των κατηγοριών από το backend
    axios.get('http://localhost:3000/api/product/categories')
    .then(response => {
      console.log(response.data.slice(0, 3));
      setCategories(response.data);
    })
    
    // Ανάκτηση του inventory από το backend
    axios.get('http://localhost:3000/api/inventory/all')
    .then(response => {
      console.log(response.data);
      setInventory(response.data);
    })
    
    // Ανάκτηση των οχημάτων από το backend
    axios.get('http://localhost:3000/api/vehicle/all')
    .then(response => {
      console.log(response.data);
      setVehicles(response.data);
    })
  }, []);
  
  if (!user) {
    console.log("User is not logged in");
    return <Navigate to="/login" />;
  }
  
  // Handle category checkbox change
  const handleCategoryChange = (category) => {
    setSelectedCategories(prevSelected => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter(c => c !== category);
      } else {
        return [...prevSelected, category];
      }
    });
  };
  
  // Handle clearing the filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
  };
  
  // Filter inventory based on selected categories
  const filteredInventory = selectedCategories.length === 0
  ? inventory
  : inventory.filter(product => selectedCategories.includes(product.category));
  
  return (
    <>
    <CustomNavbar user={user} />
    <Container>
    <Tabs defaultActiveKey="interest" id="warehouse-tabs" style={{ marginTop: '10px' }}>
    <Tab eventKey="interest" title="Γενικά">
    <h1 style={{ marginTop: '20px' }}>
    Γενικά
    <Button variant="primary" style={{ float: 'right', marginLeft: '10px', marginBottom: '5px' }} onClick={syncWithCEID}>
    <Download /> Sync with JSON
    </Button>
    <Button variant="primary" style={{ float: 'right', marginLeft: '10px', marginBottom: '5px' }} onClick={openFileModal}>
    <Upload /> Αποστολή Αρχείου
    </Button>
    </h1>
    <Row style={{ marginTop: '20px' }}>
    <Col md={8}>
    <h2>Προϊόντα Ενδιαφέροντος
    <Button style={{ float: 'right', marginLeft: '10px', marginBottom: '5px' }} className="btn btn-primary" onClick={handleAddProduct}> + </Button>
    </h2>
    {productToEdit.name ? (
      <ProductForm isOpen={itemModalIsOpen} onClose={closeItemModal} productToEdit={productToEdit} />
    ) : (
      <ProductForm isOpen={itemModalIsOpen} onClose={closeItemModal} />
    )}
    <Table striped bordered hover>
    <thead>
    <tr>
    <th>Όνομα Προϊόντος</th>
    <th>Κατηγορία</th>
    <th>Λεπτομέρειες</th>
    <th>Ενέργειες</th>
    </tr>
    </thead>
    <tbody>
    {products.map(product => (
      <tr key={product.id}>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.details.map(detail => (
        <div key={detail.index}>{detail.name} {(detail.name && detail.value) && ':'} {detail.value}</div>
      ))}</td>
      <td>
      <Button style={{ margin: '5px' }} variant="info" onClick={() => handleEditProduct(product.id)}>
      <Pencil style={{ color: 'white' }} />
      </Button>
      <Button style={{ margin: '5px' }} variant="danger" onClick={() => handleDeleteProduct(product.id)}>
      <Trash />
      </Button>
      </td>
      </tr>
    ))}
    </tbody>
    </Table>
    </Col>
    <Col md={4}>
    <h2>Κατηγορίες
    <Button style={{ float: 'right', marginLeft: '10px', marginBottom: '5px' }} className="btn btn-primary" onClick={handleAddCategory}> + </Button>
    </h2>
    {categoryToEdit.name ? (
      <CategoryForm isOpen={categoryModalIsOpen} onClose={closeCategoryModal} categorytoEdit={categoryToEdit} />
    ) : (
      <CategoryForm isOpen={categoryModalIsOpen} onClose={closeCategoryModal} />
    )}
    <Table striped bordered hover>
    <thead>
    <tr>
    <th>Όνομα</th>
    <th>Ενέργειες</th>
    </tr>
    </thead>
    <tbody>
    {categories.map(category => (
      <tr key={category.id}>
      <td>{category.name}</td>
      <td>
      <Button style={{ margin: '5px' }} variant="info" onClick={() => handleEditCategory(category.id)}>
      <Pencil style={{ color: 'white' }} />
      </Button>
      <Button style={{ margin: '5px' }} variant="danger" onClick={() => handleDeleteCategory(category.id)}>
      <Trash />
      </Button>
      </td>
      </tr>
    ))}
    </tbody>
    </Table>
    </Col>
    </Row>
    </Tab>
    <Tab eventKey="warehouse" title="Προϊόντα Εντός Αποθήκης">
    <h1 style={{ marginTop: '20px' }}>Προϊόντα Εντός Αποθήκης</h1>
    <Table striped bordered hover>
    <thead>
    <tr>
    <th>Όνομα Προϊόντος</th>
    <th>Ποσότητα</th>
    <th>Ενέργειες</th>
    </tr>
    </thead>
    <tbody>
    {Array.isArray(inventory) && inventory.length > 0 ? (
      inventory.filter(product => product.location === 'Base').map(entry => (
        <tr key={entry.index}> 
        <td>{entry.product}</td>
        <td>
        <Form.Control
        type="number"
        value={entry.quantity}
        onChange={(e) => handleQuantityChange(entry.id, entry.productId, e.target.value)}
        style={{ width: '100px' }}
        />
        </td>
        <td>
        <Button style = {{margin:'5px'}} variant="info" onClick={() => openWarehouseModal(entry)}>
        <Send style={{color:'white'}}/> 
        </Button>
        <Button variant="danger" onClick={() => handleDeleteProduct(entry.id)}>
        <Trash />
        </Button>
        </td>
        </tr>
      ))
    ) : (
      <tr>
      <td colSpan="3">No products available</td>
      </tr>
    )}
    </tbody>
    </Table>
    </Tab>
    <Tab eventKey="stock" title="Κατάσταση">
    <h1 style={{ marginTop: '20px' }}>Κατάσταση</h1>
    <Row>
    <Col md={3}>
    <Form.Group controlId="categoryFilter">
    <Form.Label>Filter by Category
    <Button variant="link" onClick={handleClearFilters}>(Clear) 
    </Button>
    </Form.Label>
    {categories.map(category => (
      <Form.Check
      key={category.id}
      type="checkbox"
      label={category.name}
      checked={selectedCategories.includes(category.name)}
      onChange={() => handleCategoryChange(category.name)}
      />
    ))}
    </Form.Group>
    </Col>
    <Col md={9}>
    <Table striped bordered hover>
    <thead>
    <tr>
    <th>Όνομα Προϊόντος</th>
    <th>Ποσότητα</th>
    <th>Κατηγορία</th>
    <th>Τοποθεσία</th>
    </tr>
    </thead>
    <tbody>
    {Array.isArray(filteredInventory) && filteredInventory.length > 0 ? (
      filteredInventory.map(entry => (
        <tr key={entry.index}>
        <td>{entry.product}</td>
        <td>{entry.quantity}</td>
        <td>{entry.category}</td>
        <td>
        {entry.location} {entry.location === 'Base' ? '' : 
          <Button style={{ margin: '5px', float:'right' }} variant="info" onClick={() => {
            openReturnModal(entry);
          }}>
          <ArrowReturnLeft style={{ color: 'white' }} />
          </Button>}
          </td>
          </tr>
        ))
      ) : (
        <tr>
        <td colSpan="4">No products available</td>
        </tr>
      )}
      </tbody>
      </Table>
      </Col>
      </Row>
      </Tab>
      </Tabs>
      </Container>
      
      {/* Modal for adding a new product */}
      <Modal show={fileModalIsOpen} onHide={closeFileModal}>
      <Modal.Header closeButton>
      <Modal.Title>Αποστολή Αρχείου</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      <Form.Group controlId="formFile">
      <Form.Label>Επιλέξτε αρχείο</Form.Label>
      <Form.Control type="file" onChange={handleFileChange} />
      </Form.Group>
      </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={closeFileModal}>Κλείσιμο</Button>
      <Button variant="primary" onClick={handleFileUpload}>Αποστολή</Button>
      </Modal.Footer>
      </Modal>
      
      {/* Modal for moving products */}
      <Modal show={warehouseModalIsOpen} onHide={closeWarehouseModal}>
      <Modal.Header closeButton>
      <Modal.Title>Move Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      <Form.Group controlId="formAmount">
      <Form.Label>Amount</Form.Label>
      <Form.Control
      type="number"
      min="1"
      max={selectedProduct ? selectedProduct.quantity : 1}
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      />
      </Form.Group>
      <Form.Group controlId="formDestination">
      <Form.Label>Destination</Form.Label>
      <Form.Control
      as="select"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      >
      <option value="">Select a destination</option>
      {vehicles.map(vehicle => (
        <option key={vehicle.id} value={vehicle.id}>{vehicle.username}</option>
      ))}
      </Form.Control>
      </Form.Group>
      </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={closeWarehouseModal}>Close</Button>
      <Button variant="primary" onClick={handleMoveProduct}>Move</Button>
      </Modal.Footer>
      </Modal>
      
      {/* Modal for returning products */}
      <Modal show={returnModalIsOpen} onHide={closeRetrurnModal}>
      <Modal.Header closeButton>
      <Modal.Title>Return Product to the Warehouse</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form>
      <Form.Group controlId="formAmount">
      <Form.Label>Amount</Form.Label>
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
      <Button variant="secondary" onClick={closeRetrurnModal}>Close</Button>
      <Button variant="primary" onClick={handleMoveProduct}>Move</Button>
      </Modal.Footer>
      </Modal>
      </>
    );
  };
  
  export default WarehouseManagement;
  