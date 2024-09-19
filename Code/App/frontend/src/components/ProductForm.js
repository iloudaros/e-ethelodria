import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import axios from 'axios';

Modal.setAppElement('#root');


const ProductForm = ({ isOpen, onClose, productToEdit='empty' }) => {
    const [categories, setCategories] = useState([]);
    const [product, setProduct] = useState({name:'', category: '', categoryId:'' ,details: {} });
    const [details, setDetails] = useState([]);
    
    // Detail Controls
    const addDetailField = () => {
        setDetails([...details, { name: '', value: '' }]);
    };
    
    const removeDetailField = (index) => {
        setDetails((prevDetails) => prevDetails.filter((_, i) => i !== index));
    };
    

    // Handle Changes in the form fields
    const handleDetailChange = (index, event) => {
        const newDetails = details.map((detail, i) => {
            if (i === index) {
                return { ...detail, [event.target.name]: event.target.value };
            }
            return detail;
        });
        setDetails(newDetails);
    }
    const handleProductChange = (event) => {
        setProduct({ ...product, [event.target.name]: event.target.value });
    };
    

    // Handle Submit
    const handleSubmit = (event) => {
        event.preventDefault();
        
        // Check if any product field is empty
        for (const field in product) {
            if (product[field] === '') {
                alert('Please fill out all fields.');
                return;
            }
        }
        
        // Check if any detail field is empty
        for (const detail of details) {
            for (const field in detail) {
                if (detail[field] === '') {
                    alert('Please fill out all detail fields.');
                    return;
                }
            }
        }
        product.details = details;
        console.log(product);
        
        // If the product is being edited, update the product in the database
        if (productToEdit.id) {
            axios.put(`http://localhost:3000/api/product/update`, product)
            .then(response => {
                if (response.status === 200) {
                    alert('Product updated successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to update product.');
                }
            })
        }
        // If the product is being created, create a new product in the database
        else {
            
            axios.post('http://localhost:3000/api/product/new', product)
            console.log('Submitted product:', product);
            
            // Empty the form fields
            setProduct({ name: '', category: '', details: {} });
            setDetails([]);
            
            // Refresh the page
            window.location.reload();
            
            onClose();
        };
    }
    



    useEffect(() => {
        // Ανάκτηση των κατηγοριών από το backend
        axios.get('http://localhost:3000/api/product/categories')
        .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        })
        
        
        // Αν η φόρμα είναι για επεξεργασία ενός προϊόντος, αντιγράφουμε τα δεδομένα του προϊόντος στο state
        if (productToEdit.id) {
            console.log('Editing product:', productToEdit);
            setProduct(productToEdit);
            setDetails(productToEdit.details || []);
            console.log(productToEdit);
        }
        else {
            console.log('Creating new product');
            setProduct({ name: '', category: '', details: {} });
            setDetails([]);
        }
        
    }, [productToEdit]);
    
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Προσθήκη Προϊόντος"
        style={{
            content: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                background: 'white',
                padding: '2rem',
                borderRadius: '10px',
                width: '80%'
            },
        }}
        >
        {productToEdit.id ? <h2 style={{marginBottom:'1rem'}}>Επεξεργασία προϊόντος</h2> :
        <h2 style={{marginBottom:'1rem'}}>Νέο Προϊόν</h2>}
        <Form onSubmit={handleSubmit}>
        <FormGroup>
        <FormLabel>Όνομα Προϊόντος:</FormLabel>
        <FormControl 
        type="text" 
        name="name"
        value={product.name}
        onChange={(event)=>handleProductChange(event)} />
        <FormLabel style={{marginTop:'1rem'}}>Κατηγορία:</FormLabel>
        <FormControl 
        as='select'
        name="category" 
        value={product.categoryId}
        onChange={(event)=>handleProductChange(event)}>
        <option value="">Select a category</option>
        {categories.map((category) => (
            <option key={category.id} value={category.id}>
            {category.name}
            </option>
        ))}
        </FormControl>
        </FormGroup>
        {details.length>0 && <div style={{ marginTop: '2rem' }}/>}
        {details.map((detail, index) => (
            <FormGroup key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <FormLabel style={{ marginRight: '1rem' }}>Λεπτομέρεια:</FormLabel>
            <FormControl
            type="text"
            name="name"
            value={detail.name}
            onChange={(event) => handleDetailChange(index, event)}
            style={{ marginRight: '1rem' }}
            />
            <FormLabel style={{ marginRight: '1rem' }}>Τιμή:</FormLabel>
            <FormControl
            type="text"
            name="value"
            value={detail.value}
            onChange={(event) => handleDetailChange(index, event)}
            style={{ marginRight: '1rem' }}
            />
            <Button type="button" onClick={() => removeDetailField(index)}style={{ margin: '5px' }} variant="danger">
            <Trash />
            </Button>
            </FormGroup>
        ))}
        <Button type="button" style={{ marginBottom: '1rem', marginTop:'1rem' }} onClick={addDetailField}>Προσθήκη Λεπτομέρειας</Button>
        <div>
        <Button variant='primary' type="submit" style={{marginRight: '1rem'}} >Submit</Button>
        <Button variant='secondary' onClick={onClose}>Close</Button>
        </div>
        </Form>
        </Modal>
    );
};

export default ProductForm;
