import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const StatisticsPage = () => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Calculate the default start and end dates
        const currentDate = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);

        const formattedCurrentDate = currentDate.toISOString().split('T')[0];
        const formattedOneMonthAgoDate = oneMonthAgo.toISOString().split('T')[0];

        setStartDate(formattedOneMonthAgoDate);
        setEndDate(formattedCurrentDate);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }

        // Fetch data with default dates
        fetchData(formattedOneMonthAgoDate, formattedCurrentDate);
    }, []);

    const fetchData = async (start, end) => {
        try {
            console.log('Fetching data...');
            console.log('Start date:', start);
            console.log('End date:', end);
            const response = await axios.get(`http://localhost:3000/api/stats/getData?start_date=${start}&end_date=${end}`);
            
            setData(response.data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleLoadButtonClick = () => {
        fetchData(startDate, endDate);
    };

    return (
        <>
            <CustomNavbar user={user} />
            <Container className="mt-4">
                <Row>
                    <Col>
                        <h1>Στατιστικά Εξυπηρέτησης</h1>
                    </Col>
                </Row>
                <Row className="justify-content-center mt-4">
                    <Col md={2}>
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group controlId="startDate">
                                        <Form.Label>Από:</Form.Label>
                                        <Form.Control type="date" value={startDate} onChange={handleStartDateChange} />
                                    </Form.Group>
                                    <Form.Group controlId="endDate" className="mt-3">
                                        <Form.Label>Έως:</Form.Label>
                                        <Form.Control type="date" value={endDate} onChange={handleEndDateChange} />
                                    </Form.Group>
                                    <div className="d-flex justify-content-end mt-3">
                                    <Button variant="primary" className="mt-3" onClick={handleLoadButtonClick}>Load</Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                {/* </Row> */}
                {/* <Row className="mt-4"> */}
                    <Col>
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="new_requests" stroke="#8884d8" />
                                <Line type="monotone" dataKey="new_offers" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="completed_requests" stroke="#ffc658" />
                                <Line type="monotone" dataKey="completed_offers" stroke="#ff7300" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default StatisticsPage;
