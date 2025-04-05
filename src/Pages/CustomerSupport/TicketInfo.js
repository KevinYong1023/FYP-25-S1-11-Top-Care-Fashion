// Pages/TicketInfo.js
import React, { useState, useEffect} from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/Sidebar';
import { useParams, useNavigate } from "react-router-dom";
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';

export default function TicketInfo() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the ticket ID from the URL

    // State to manage the ticket data and status
    const [ticket, setTicket] = useState(null); // Store the ticket object
    const [ticketStatus, setTicketStatus] = useState('');
    const [userName, setUserName] = useState(""); // State to store user name

    // Get email from localStorage
    const email = localStorage.getItem("email");

    // Fetch user details based on email and retrieve the user's name
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`);
                    const data = await response.json();
                    setUserName(data.name); // Set the user's name
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                console.log("EMAIL HAVEN'T BEEN PASSED IN YET");
            }
        };
        fetchUserDetails();
    }, [email]);

    useEffect(() => {
        const fetchTicket = async () => {
            console.log("ID", id);
            try {
                const response = await fetch(`/api/tickets/${id}`); // Assuming your backend route is /api/tickets/:id
                if (response.ok) {
                    const data = await response.json(); // Parse the response as JSON
                    console.log(data);
                    setTicket(data); // Set the ticket data
                    setTicketStatus(data.status); // Set the ticket's current status
                } else {
                    console.error('Error fetching ticket:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching ticket:', error);
            }
        };
        fetchTicket();
    }, [id]);

    const handleDeleteTicket = async () => {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                navigate("/dashboard"); // Redirect after deletion
            } else {
                alert('Failed to delete ticket');
            }
        } catch (error) {
            console.error('Error deleting the ticket:', error);
        }
    };

    const handleAssignToMeTicket = async () => {
        try {
            const response = await fetch(`/api/tickets/${id}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignee: userName, status: "In Progress" }), // Send both assignee and status
            });

            if (response.ok) {
                navigate("/dashboard"); // Redirect after updating
            } else {
                alert('Failed to assign ticket');
            }
        } catch (error) {
            console.error('Error assigning the ticket:', error);
        }
    };

    const handleUpdateTicket = async () => {
        try {
            const response = await fetch(`/api/tickets/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: ticketStatus }), // Update the status based on the dropdown value
            });

            if (response.ok) {
                navigate("/dashboard"); // Redirect after update
            } else {
                alert('Failed to update ticket status');
            }
        } catch (error) {
            console.error('Error updating the ticket status:', error);
        }
    };

    const handleRemoveTicket = async () => {
        try {
            const response = await fetch(`/api/tickets/${id}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assignee: "", status: "Open" }),
            });

            if (response.ok) {
                alert('Removed');
                navigate("/dashboard"); // Redirect after updating
            } else {
                alert('Failed to assign ticket');
            }
        } catch (error) {
            console.error('Error assigning the ticket:', error);
        }
    };

    // Simulate status update by changing the local state
    function handleStatusChange(event) {
        setTicketStatus(event.target.value); // Update the status state
    }

    if (!ticket) {
        return <p>Ticket not found</p>; // Handle if the ticket ID doesn't exist
    }

    return (
        <>
        <AuthorityHeader/>
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
                            <p><strong>Name: {ticket.user}</strong></p>
                            <p><strong>Description: {ticket.description}</strong></p>
                            <p><strong>Assignee: {ticket.assignee}</strong></p>
                            <p><strong>Created: {ticket.created}</strong></p>
                            {/* Editable Dropdown for Status */}
                            <Form.Group controlId="formTicketStatus">
                                <Form.Label><strong>Ticket Status:</strong></Form.Label>
                                <Form.Control
                                    as="select"
                                    disabled={ticketStatus === "Open"}
                                    value={ticketStatus} // Set the default value to ticket's current status
                                    onChange={handleStatusChange} // Handle the change event
                                >
                                    { ticketStatus === "Open" ? <option value="Open">Open</option>:<></>}
                                    <option value="In Progress">In Progress</option>
                                    <option value="Close">Close</option>
                                </Form.Control>
                            </Form.Group>
                            <hr />
                            <div style={{ display: 'flex', gap: '10px' }}>
                            <Button
                                    onClick={handleDeleteTicket} // Handle delete
                                    variant="danger"
                                    style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Delete
                                </Button>
                                {
                                    ticketStatus === "Open" ?
                                    <Button
                                    onClick={handleAssignToMeTicket} // Handle assigning to logged-in user
                                    variant="outline-secondary"
                                    disabled={ticketStatus !== "Open"}
                                    style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Assign to me
                                </Button>
                                    :
                                    <>
                                    <Button
                                    onClick={handleUpdateTicket} // Handle status update
                                    variant="outline-secondary"
                                    disabled={ticketStatus === "Open"}
                                    style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Update Ticket
                                </Button>
                                <Button
                                     onClick={handleRemoveTicket} // Handle status update
                                     variant="outline-secondary"
                                     disabled={ticketStatus === "Open"}
                                     style={{ borderRadius: '20px', padding: '10px 20px' }}
                                >
                                    Remove My Name
                                </Button>
                                </>
                                }
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </>
    );
}
