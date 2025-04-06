import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Pagination, Form } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/CustomerSupportSidebar';
import { Link } from 'react-router-dom';
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';
import { AuthContext } from '../../App';

export default function Dashboard() {
    const [ticketList, setTicketList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const { name } = useContext(AuthContext); // Get the current user's name
    const ticketsPerPage = 10; // Number of tickets per page

    // Fetch tickets from the backend API
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await fetch('/api/tickets');
                const data = await response.json();
                setTicketList(data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            }
        };
        fetchTickets();
    }, []);

    // Pagination Logic
    const openTickets = ticketList.filter((ticket) => ticket.status === 'Open' && ticket.assignee === "");
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = openTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(openTickets.length / ticketsPerPage);

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => setCurrentPage(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                {items}
                <Pagination.Next
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        );
    };

    async function handleDelete(id) {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedTickets = ticketList.filter((ticket) => ticket.ticketId !== id);
                setTicketList(updatedTickets);
            } else {
                alert('Failed to delete the ticket');
            }
        } catch (error) {
            console.error('Error deleting the ticket:', error);
        }
    }

    async function assignTicket(ticketId) {
        try {
            const requestBody = {
                assignee: name,
                status: "In Progress",
            };

            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const updatedTickets = ticketList.map((ticket) =>
                    ticket.ticketId === ticketId ? { ...ticket, assignee: name, status: 'In Progress' } : ticket
                );
                setTicketList(updatedTickets);
            } else {
                alert('Failed to assign the ticket');
            }
        } catch (error) {
            console.error('Error assigning the ticket:', error);
        }
    }

    return (
        <>
            <AuthorityHeader />
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>
                    <Col style={{ margin: '10px' }}>
                        <h1>Welcome {name ? name : "User"}</h1>
                        <p>Following are the tickets</p>
                        <hr />
                        <h2>All Available Tickets</h2>
                        <a href="/assigned-ticket">Your Tickets</a>
                        <hr />
                        <div>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>User</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTickets.map((ticket, index) => (
                                        <tr key={ticket.ticketId}>
                                            <td>{ticket.ticketId}</td>
                                            <td>{ticket.user}</td>
                                            <td>{ticket.status}</td>
                                            <td>{ticket.created}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Link to={`/ticket-info/${ticket.ticketId}`} rel="noopener noreferrer">
                                                        <Button variant="primary" size="sm">Review</Button>
                                                    </Link>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(ticket.ticketId)}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => assignTicket(ticket.ticketId)}
                                                    >
                                                        Assign to me
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {renderPagination()}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
