import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Button, Form, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import axios from 'axios';

Modal.setAppElement('#root');

const CategoryForm = ({ isOpen, onClose, categorytoEdit='' }) => {
    const [categoryName, setCategoryName] = useState('');
    
    // Handle changes in the form fields
    const handleChange = (event) => {
        setCategoryName(event.target.value);
    };
    
    
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Make sure the category name is not empty
        if (!categoryName.trim()) {
            alert('Please enter a category name.');
            return;
        }
        
        console.log(`New name: ${categoryName}`);
        
        if (categorytoEdit.id) {
            // Update the category
            axios.put('http://localhost:3000/api/product/category/update', {
                id: categorytoEdit.id,
                name: categoryName
            });
        } else {
            // Add the new category
            axios.post('http://localhost:3000/api/product/category/new', { name: categoryName });
            
        }
        
        // Refresh the page after adding a new category
        window.location.reload();
        onClose();
    };
    
    
    useEffect(() => {
        // Αν η φόρμα είναι για επεξεργασία, αντιγράφουμε τα δεδομένα στο state
        if (categorytoEdit.id) {
            console.log('Editing category:', categorytoEdit);
            setCategoryName(categorytoEdit.name);
        }
        else {
            console.log('Creating new category');
            setCategoryName('');
        }
        
    }, [categorytoEdit]);
    
    return (
        <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Form Popup"
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
                width: '50%'
            },
        }}
        >
        {categorytoEdit.id ? <h2 style={{marginBottom:'1rem'}}>Επεξεργασία Κατηγορίας</h2> :
        <h2 style={{marginBottom:'1rem'}}>Νέα Κατηγορία</h2>}
        <Form onSubmit={handleSubmit}>
        <FormGroup>
        <FormLabel>Name:</FormLabel>
        <FormControl type="text" name="name" value={categoryName} onChange={(event) =>handleChange(event)} />
        </FormGroup>
        <div>
        <Button variant='primary' type="submit" style={{ marginBottom: '1rem', marginTop:'1rem', marginRight:'1rem' }}>Submit</Button>
        <Button variant='secondary' onClick={onClose}>Close</Button>
        </div>
        </Form>
        </Modal>
    );
};

export default CategoryForm;
