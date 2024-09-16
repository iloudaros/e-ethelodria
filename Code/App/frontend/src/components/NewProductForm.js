// src/PopupForm.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

Modal.setAppElement('#root');

const StyledModal = styled(Modal)`
    position: absolute;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const FormTitle = styled.h2`
    margin-bottom: 1rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-weight: bold;
`;

const Input = styled.input`
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    box-sizing: border-box;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #0056b3;
    }

    &:not(:last-child) {
        margin-right: 0.5rem;
    }
`;

const CloseButton = styled(Button)`
    background-color: #6c757d;

    &:hover {
        background-color: #5a6268;
    }
`;

const PopupForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Optionally, you can clear the form or close the modal here
        // setFormData({ name: '', email: '' });
        // onClose();
    };

    return (
        <StyledModal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Form Popup"
        >
            <FormTitle>Form Title</FormTitle>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Name:</Label>
                    <Input type="text" name="name" value={formData.name} onChange={handleChange} />
                </FormGroup>
                <FormGroup>
                    <Label>Email:</Label>
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                </FormGroup>
                <div>
                    <Button type="submit">Submit</Button>
                    <CloseButton onClick={onClose}>Close</CloseButton>
                </div>
            </Form>
        </StyledModal>
    );
};

export default PopupForm;
