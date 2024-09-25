import React, { useState, useEffect } from 'react';
import { Button, Container, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import CustomNavbar from '../components/Navbar';
import { Trash, Key, Plus } from 'react-bootstrap-icons';

const RescuerManagement = () => {
    const [rescuers, setRescuers] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedRescuer, setSelectedRescuer] = useState(null);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const fetchRescuers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/rescuers'); 
            setRescuers(response.data);
        } catch (error) {
            console.error('Error fetching rescuers:', error);
        }
    };

    // API Calls

    // Creaate rescuer
    const handleCreateRescuer = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/users/new/rescuer', { username, name, surname, telephone, password });
            setShowCreateModal(false);
            window.location.reload();
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                setUsernameError('User already exists');
            } else {
                console.error('Error creating rescuer:', error);
            }
        }
    };

    // Delete rescuer
    const confirmDeleteRescuer = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/users/delete/${selectedRescuer.id}`);
            setRescuers(rescuers.filter(r => r.id !== selectedRescuer.id));
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error deleting rescuer:', error);
        }
    };

    // Reset password
    const confirmResetPassword = async () => {
        if (newPassword === '') {
            alert('Please enter a new password');
            return;
        }
        try {
            await axios.post(`http://localhost:3000/api/users/reset-password/${selectedRescuer.id}`, { password: newPassword }).then(response => {
                alert('Password reset successfully');
                window.location.reload();
            });
            setShowConfirmModal(false);
        } catch (error) {
            console.error('Error resetting password:', error);
        }
    };

    // Modal Handlers
    const handleDeleteRescuer = (rescuer) => {
        setSelectedRescuer(rescuer);
        setConfirmAction('delete');
        setShowConfirmModal(true);
    };

    const handleResetPassword = (rescuer) => {
        setSelectedRescuer(rescuer);
        setConfirmAction('reset');
        setShowConfirmModal(true);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }
        fetchRescuers();
    }, []);

    // Render
    if (!user || !rescuers) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <CustomNavbar user={user} />
            <h1>Διαχείριση Διασωστών</h1>
            <Button className='primary' style={{ marginBottom: '10px', float: 'right' }} onClick={() => setShowCreateModal(true)}>
                <Plus /> Προσθήκη Διασώστη
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ονοματεπώνυμο</th>
                        <th>Τηλέφωνο</th>
                        <th>Κωδικός Πρόσβασης</th>
                        <th>Ενέργειες</th>
                    </tr>
                </thead>
                <tbody>
                    {rescuers.map((rescuer) => (
                        <tr key={rescuer.id}>
                            <td>{`${rescuer.name} ${rescuer.surname}`}</td>
                            <td>{rescuer.telephone}</td>
                            <td>{rescuer.password}</td>
                            <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button variant="danger" onClick={() => handleDeleteRescuer(rescuer)}>
                                    <Trash /> 
                                </Button>
                                <Button variant="warning" onClick={() => handleResetPassword(rescuer)}>
                                    <Key /> 
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for creating a new rescuer */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} style={{ marginBottom: '1rem' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Προσθήκη Νέου Διασώστη</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateRescuer}>
                        <Form.Group controlId="formUsername" style={{ marginBottom: '1rem' }}>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setUsernameError('');
                                }}
                                required
                            />
                            {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}
                        </Form.Group>
                        <Form.Group controlId="formName" style={{ marginBottom: '1rem' }}>
                            <Form.Label>Όνομα</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formSurname" style={{ marginBottom: '1rem' }}>
                            <Form.Label>Επώνυμο</Form.Label>
                            <Form.Control
                                type="text"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTelephone" style={{ marginBottom: '1rem' }}>
                            <Form.Label>Τηλέφωνο</Form.Label>
                            <Form.Control
                                type="text"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword" style={{ marginBottom: '1rem' }}>
                            <Form.Label>Κωδικός Πρόσβασης</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
                            Δημιουργία
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for confirming actions */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Επιβεβαίωση Ενέργειας</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {confirmAction === 'delete' ? (
                        <p>Είστε σίγουροι ότι θέλετε να διαγράψετε τον διασώστη {selectedRescuer && selectedRescuer.name} {selectedRescuer && selectedRescuer.surname};</p>
                    ) : (
                        <>
                        <p>Είστε σίγουροι ότι θέλετε να κάνετε reset τον κωδικό πρόσβασης του διασώστη {selectedRescuer && selectedRescuer.name} {selectedRescuer && selectedRescuer.surname};</p>
                        <Form.Group controlId="formNewPassword">
                                <Form.Label>Νέος Κωδικός Πρόσβασης</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Εισάγετε τον νέο κωδικό πρόσβασης"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Ακύρωση
                    </Button>
                    <Button variant="primary" onClick={confirmAction === 'delete' ? confirmDeleteRescuer : confirmResetPassword}>
                        Επιβεβαίωση
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RescuerManagement;
