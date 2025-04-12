import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';
import '../../css/TotalTicket.css';

export default function TotalTicket({ email }) {
    const [ticketList, setTicketList] = useState([]);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`);
                    const data = await response.json();
                    setUserName(data.name);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            } else {
                console.log('EMAIL HAS NOT BEEN PASSED IN YET');
            }
        };
        fetchUserDetails();
    }, [email]);

    useEffect(() => {
        const fetchAssignedTickets = async () => {
            if (userName) {
                try {
                    const response = await fetch(`/api/tickets`);
                    if (response.ok) {
                        const data = await response.json();
                        const filteredData = data.filter(ticket => ticket.assignee === userName && ticket.status !== 'Close');
                        setTicketList(filteredData);
                    } else {
                        console.error('Failed to fetch tickets');
                    }
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                }
            }
        };
        fetchAssignedTickets();
    }, [userName]);

    async function handleDelete(id) {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedTickets = ticketList.filter(ticket => ticket._id !== id);
                setTicketList(updatedTickets);
                alert('Ticket deleted successfully');
            } else {
                alert('Failed to delete the ticket');
            }
        } catch (error) {
            console.error('Error deleting the ticket:', error);
        }
    }

    async function removeAssign(ticketId) {
        try {
            const requestBody = {
                assignee: '',
                status: 'Open',
            };

            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const updatedTickets = ticketList.filter(ticket => ticket._id !== ticketId);
                setTicketList(updatedTickets);
                alert('Ticket assignment removed successfully');
            } else {
                alert('Failed to remove assignment');
            }
        } catch (error) {
            console.error('Error updating the ticket:', error);
        }
    }

    const goBack = () => {
        navigate(-1);
    };

    return (
        <>
            <AuthorityHeader />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={12} md={10} className="ticket-container">
                        <h2 className="ticket-heading">Your Tickets</h2>
                        <hr />
                        <table className="table table-bordered ticket-table">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticketList.map((row, index) => (
                                    <tr key={row._id}>
                                        <td>{index + 1}</td>
                                        <td>{row.user}</td>
                                        <td>{row.status}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link to={`/ticket-info/${row._id}`}>
                                                    <Button variant="primary" size="sm">Review</Button>
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(row._id)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => removeAssign(row._id)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4">
                            <Button variant="secondary" onClick={goBack}>Back</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
