import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Pagination, Spinner } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/CustomerSupportSidebar';
import { Link } from 'react-router-dom';
import CustomerSupportHeader from '../../Components/Headers/CustomerSupportHeader';
import { AuthContext } from '../../App';

export default function Dashboard() {
    const [ticketList, setTicketList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const { name } = useContext(AuthContext); // Get the current user's name
    const ticketsPerPage = 10; // Number of tickets per page
    const [isLoading,setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Fetch tickets from the backend API
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/tickets');
                const data = await response.json();
                setTicketList(data);
            } catch (error) {
                setError("Server Error: Please Refresh the Page")
                console.error('Error fetching tickets:', error);
            }finally {
                setIsLoading(false); // Set loading to false when fetch completes
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
            setIsLoading(true)
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
            setError("Server Error: Please Try Again")
            console.error('Error deleting the ticket:', error);
        }finally{
            setIsLoading(false)
        }
    }

    async function assignTicket(ticketId) {
        try {
            setIsLoading(true)
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
            setError("Server Error: Please Try Again")
            console.error('Error assigning the ticket:', error);
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <>
            <CustomerSupportHeader />
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>
                    <Col style={{ margin: '10px' }}>
                    {!error?<></>: <div className="alert alert-danger" role="alert">
                                  {error}
                                </div>}
                        <div className="d-flex justify-content-between align-items-center">
                            <h2>All Available Tickets</h2>
                            <Button 
                                as="a" 
                                href="/assigned-ticket" 
                                variant="outline-primary" 
                                size="lg"
                            >
                                Your Tickets
                            </Button>
                        </div>
                        <hr />
                        {isLoading ? (
                            <div className="text-center" style={{ marginTop: '100px' }}>
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Loading</span>
                                </Spinner>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ) : (
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
                            {renderPagination()}
                        </div>
                    )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
