import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { CheckCircle, XCircle } from 'react-bootstrap-icons';
import axios from 'axios';

const TaskPanel = ({ tasks, offers, requests }) => {

    // Ensure vehicle, offers, and requests are provided
    if (!tasks || !offers || !requests) {
        return <div>Loading...</div>;
    }

    // Filter offers and requests and keep only the ones that exist some task.id
    const filteredOffers = offers.filter(offer => tasks.some(task => task.id === offer.id));
    const filteredRequests = requests.filter(request => tasks.some(task => task.id === request.id));

    console.log('TaskPanel - Filtered offers:', filteredOffers);
    console.log('TaskPanel - Filtered requests:', filteredRequests);

    // Function to handle task completion
    const handleComplete = (task) => {
        // Logic to mark the task as completed
        console.log(`Task completed: ${task.id}`);

        // Send a request to the server to mark the task as completed
        axios.post(`http://localhost:3000/api/tasks/complete/${task.id}`)
        .then(response => {
            console.log('Task completed:', response.data);
            // Optionally, you can update the UI to reflect the change
            window.location.reload();
        })
        .catch(error => {
            console.error('Error completing task:', error);
        });

    };

    // Function to handle task cancellation
    const handleCancel = (task) => {
        // Logic to cancel the task
        console.log(`Task cancelled: ${task.id}`);
        
        // Send a request to the server to cancel the task
        axios.post(`http://localhost:3000/api/tasks/cancel/${task.id}`)
        .then(response => {
            console.log('Task cancelled:', response.data);
            // Optionally, you can update the UI to reflect the change
            window.location.reload();
        })
        .catch(error => {
            console.error('Error cancelling task:', error);
        });
    };
    

    return (
        <Card style={{ padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '100%' }}>
            <Card.Header> Current Tasks</Card.Header>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Citizen</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOffers.length === 0 && filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>No tasks available</td>
                            </tr>
                        ) : (
                            <>
                                {filteredOffers.map(offer => (
                                    <tr key={offer.id}>
                                        <td>{offer.userName}</td>
                                        <td>{offer.userTelephone}</td>
                                        <td>{offer.date_in.split('T')[0]}</td>
                                        <td>
                                            <Button variant="success" onClick={() => handleComplete(offer)} style={{ marginRight: '10px' }}>
                                                <CheckCircle />
                                            </Button>
                                            <Button variant="danger" onClick={() => handleCancel(offer)}>
                                                <XCircle />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.map(request => (
                                    <tr key={request.id}>
                                        <td>{request.userName}</td>
                                        <td>{request.userTelephone}</td>
                                        <td>{request.date_in.split('T')[0]}</td>
                                        <td>
                                            <Button variant="success" onClick={() => handleComplete(request)} style={{ marginRight: '10px' }}>
                                                <CheckCircle />
                                            </Button>
                                            <Button variant="danger" onClick={() => handleCancel(request)}>
                                                <XCircle />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};

export default TaskPanel;
