import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Button, Pagination,Spinner } from 'react-bootstrap';
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
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Main content */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#f0efeb' }}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
    
            {isLoading ? (
              <div className="text-center" style={{ marginTop: '100px' }}>
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading</span>
                </Spinner>
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              <>
                <h2 style={{ color: '#6e4f37'}}>Your Tickets</h2>
                <hr />
                <table
                  className="table table-hover table-striped"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <thead style={{ backgroundColor: '#a5a58d', color: '#ffffff' }}>
                    <tr>
                      <th style={{ backgroundColor: "#6b705c", color: "white" }}>Ticket No.</th>
                      <th style={{ backgroundColor: "#6b705c", color: "white" }}>User</th>
                      <th style={{ backgroundColor: "#6b705c", color: "white" }}>Status</th>
                      <th style={{ backgroundColor: "#6b705c", color: "white" }}>Created</th>
                      <th style={{ backgroundColor: "#6b705c", color: "white" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket) => (
                      <tr key={ticket.ticketId}>
                        <td>{ticket.ticketId}</td>
                        <td>{ticket.user}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.created}</td>
                        <td className='text-center'>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <Link to={`/ticket-info/${ticket.ticketId}`} rel="noopener noreferrer">
                              <Button variant="success" size="lg" 
                              style={{ fontSize: '16px', marginRight: '20px', backgroundColor: '#97a97c', borderColor: '#97a97c' }}>
                                Review
                              </Button>
                            </Link>
                            <Button
                              variant="danger"
                              size="lg"
                              style={{ fontSize: '16px', marginRight: '20px', backgroundColor: '#ef233c', borderColor: '#ef233c' }}
                              onClick={() => handleDelete(ticket.ticketId)}
                            >
                              Delete
                            </Button>
                            <Button
                               variant="warning"
                              size="lg"
                              style={{ fontSize: '16px', marginRight: '20px', backgroundColor: '#ffcb69', borderColor: '#ffcb69' }}
                              onClick={() => removeAssign(ticket.ticketId)}
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </>
    );
    
  
}
