import React, { useState,useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import UserHeader from '../Components/Headers/userHeader';
import { useNavigate, useParams } from 'react-router-dom';

export default function CreateTicket({ email }) {
    const { orderId } = useParams(); // Get product ID from route
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`); 
                    const data = await response.json();
                    setName(data.name);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    const handleChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!description.trim()) {
            setError('Description is required');
            return;
        }
      
        try {
            const response = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: parseInt(orderId),
                    user: name,
                    description
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create ticket');
            }else{
            navigate('/your-orders')
            setError('');
            setDescription('');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <UserHeader loginStatus={true} />
            <Container fluid className="mt-4">
                <h2>Create a Ticket</h2>
                <hr />
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Order ID</Form.Label>
                        <Form.Control type="text" value={orderId} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>User</Form.Label>
                        <Form.Control type="text" value={name} disabled />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={description}
                            onChange={handleChange}
                            placeholder="Describe your issue here"
                        />
                    </Form.Group>
                    <Button  style={{
                                                    backgroundColor: "#97a97c",
                                                    borderColor: "#97a97c",
                                                    color: "white",
                                                    transition: "background-color 0.3s ease",
                                                  }}
                                                  onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = "#85986c";
                                                    e.target.style.borderColor = "#85986c";
                                                  }}
                                                  onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = "#97a97c";
                                                    e.target.style.borderColor = "#97a97c";
                                                  }} type="submit">
                        Submit Ticket
                    </Button>
                  
                </Form>
            </Container>
        </>
    );
}
