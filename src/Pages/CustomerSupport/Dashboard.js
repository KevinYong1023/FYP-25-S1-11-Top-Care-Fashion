import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Pagination } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/Sidebar';
import { Link } from 'react-router-dom';
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';
import { AuthContext } from '../../App';

export default function Dashboard() {
    const [ticketList, setTicketList] = useState([]);
    const [userName, setUserName] = useState("");
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const { email } = useContext(AuthContext);
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

    // Fetch user details based on email
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
            }
        };
        fetchUserDetails();
    }, [email]);

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
                const updatedTickets = ticketList.filter((ticket) => ticket._id !== id);
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
                assignee: userName,
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
                    ticket._id === ticketId ? { ...ticket, assignee: userName, status: 'In Progress' } : ticket
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
                        <h1>Welcome {userName ? userName : "User"}</h1>
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
                                    {currentTickets.map((row, index) => (
                                        <tr key={row.ticketId}>
                                            <td>{row.ticketId}</td>
                                            <td>{row.user}</td>
                                            <td>{row.status}</td>
                                            <td>{row.created}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <Link to={`/ticket-info/${row._id}`} rel="noopener noreferrer">
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
                                                        variant="warning"
                                                        size="sm"
                                                        onClick={() => assignTicket(row._id)}
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
