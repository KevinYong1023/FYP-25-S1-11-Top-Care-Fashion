import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Button, Pagination,Spinner } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/CustomerSupportSidebar';
import { Link } from 'react-router-dom';
import CustomerSupportHeader from '../../Components/Headers/CustomerSupportHeader';

export default function TotalTicket() {
    const [ticketList, setTicketList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const ticketsPerPage = 10; // Number of tickets per page
    const { name } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAssignedTickets = async () => {
            if (name) {
                try {
                    setIsLoading(true)
                    const response = await fetch(`/api/tickets`);
                    if (response.ok) {
                        const data = await response.json();
                        // Filter by assignee and exclude tickets with status "Closed"
                        const filteredData = data.filter(ticket => ticket.assignee === name && ticket.status !== 'Close');
                        setTicketList(filteredData); // Update the ticket list
                    } else {
                        console.error('Failed to fetch tickets');
                    }
                } catch (error) {
                    setError("Server Error: Please Refresh the Page")
                    console.error('Error fetching tickets:', error);
                }finally{
                    setIsLoading(false)
                }
            }
        };
        fetchAssignedTickets();
    }, [name]); // Run this effect when userName is set

    // Pagination Logic
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = ticketList.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(ticketList.length / ticketsPerPage);

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

    // Function to handle deletion of a ticket
    async function handleDelete(ticketId) {
        try {
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedTickets = ticketList.filter((ticket) => ticket.ticketId !== ticketId);
                setTicketList(updatedTickets);
                alert('Ticket deleted successfully');
            } else {
                alert('Failed to delete the ticket');
            }
        } catch (error) {
            setError("Server Error: Please Refresh the Page")
            console.error('Error deleting the ticket:', error);
        }
    }

    // Function to remove assignment and reopen the ticket
    async function removeAssign(ticketId) {
        try {
            const requestBody = {
                assignee: "", // Clear the assignee
                status: "Open", // Reopen the ticket
            };

            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                const updatedTickets = ticketList.filter((ticket) => ticket.ticketId !== ticketId);
                setTicketList(updatedTickets);
                alert('Ticket assignment removed successfully');
            } else {
                alert('Failed to remove assignment');
            }
        } catch (error) {
            setError("Server Error: Please Refresh the Page")
            console.error('Error updating the ticket:', error);
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
                    <Col>
                    {!error?<></>: <div className="alert alert-danger" role="alert">
                                  {error}
                                </div>}
                    {
                         isLoading ? (
                            <div className="text-center" style={{ marginTop: '100px' }}>
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Loading</span>
                                </Spinner>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ):<>
                        
                  
                        <h2>Your Tickets</h2>
                        <hr />
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>User</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTickets.map((row, index) => (
                                    <tr key={row.ticketId}> {/* Use ticketId instead of _id */}
                                        <td>{row.ticketId}</td>
                                        <td>{row.user}</td>
                                        <td>{row.status}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link to={`/ticket-info/${row.ticketId}`} rel="noopener noreferrer"> {/* Update to use ticketId in URL */}
                                                    <Button variant="primary" size="sm">Review</Button>
                                                </Link>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(row.ticketId)} 
                                                >
                                                    Delete
                                                </Button>

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => removeAssign(row.ticketId)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        {renderPagination()}</>}
                    </Col>  
                </Row>
            </Container>
        </>
    );
}
