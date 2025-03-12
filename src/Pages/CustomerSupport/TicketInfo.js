// Pages/TicketInfo.js
import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import { useParams, useNavigate } from "react-router-dom";
import tickets from "../../mockdata/ticket.json"; // Ticket Mock Data

export default function TicketInfo() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ticket ID from the URL

    // Find the ticket by ID from the mock data
    const ticket = tickets.find((t) => t.id === parseInt(id));

    // State to manage the ticket status
    const [ticketStatus, setTicketStatus] = useState(ticket ? ticket.status : '');

    function routeToUser() {
        navigate("/chatbox");
    }

    function routeToDelete() {
        navigate("/ticket-delete");
    }

    // Simulate status update by changing the local state
    function handleStatusChange(event) {
        setTicketStatus(event.target.value); // Update the status state
    }

    // Simulate saving the status and redirecting to dashboard
    function handleUpdateTicket() {
        // Update the ticket status in the mock data (simulation)
        const updatedTicket = tickets.find((t) => t.id === parseInt(id));
        if (updatedTicket) {
            updatedTicket.status = ticketStatus; // Simulate the status update
        }

        // Navigate back to the dashboard after update
        navigate("/dashboard");
    }

    if (!ticket) {
        return <p>Ticket not found</p>; // Handle if the ticket ID doesn't exist
    }

    return (
        <Container fluid>
            <Row className="d-flex">
                {/* Sidebar - fixed width, no padding */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                    <Sidebar />
                </Col>

                {/* Main Content */}
                <Col md={10} style={{ padding: '20px' }}>
                    <Row>
                        <hr />
                        <Col md={6}>
                            <p><strong>Ticket ID: {ticket.id}</strong></p>
                            <p><strong>Name: {ticket.name}</strong></p>
                            <p><strong>Description: {ticket.desc}</strong></p>
                            <p><strong>Assignee: {ticket.assigned}</strong></p>
                            <p><strong>Created: {ticket.created}</strong></p>
                            {/* Editable Dropdown for Status */}
                            <Form.Group controlId="formTicketStatus">
                                <Form.Label><strong>Ticket Status:</strong></Form.Label>
                                <Form.Control
                                    as="select"
                                    value={ticketStatus} // Set the default value to ticket's current status
                                    onChange={handleStatusChange} // Handle the change event
                                >
                                    <option value="Open">Open</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="close">Close</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button
                                    variant="primary"
                                    onClick={routeToUser}
                                    style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Chat with User
                                </Button>
                                <Button
                                    onClick={routeToDelete}
                                    variant="danger"
                                    style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={handleUpdateTicket} // Trigger the update and redirect
                                    variant="outline-secondary"
                                    style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Update Ticket
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
