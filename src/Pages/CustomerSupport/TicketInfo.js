import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner} from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import CustomerSupportHeader from '../../Components/Headers/CustomerSupportHeader';

export default function TicketInfo({ email }) {
    const navigate = useNavigate();
    const { ticketId } = useParams(); // Get the ticketId from the URL

    // State to manage the ticket data and status
    const [ticket, setTicket] = useState(null);
    const [ticketStatus, setTicketStatus] = useState('');
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [error, setError] = useState("")

    // Fetch user details based on email and retrieve the user's name
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    setIsLoading(true);
                    const response = await fetch(`/api/user/${email}`);
                    const data = await response.json();
                    setUserName(data.name); // Set the user's name
                } catch (error) {
                    setError("Server Error: Please Refresh the Page")
                    console.error('Error fetching user details:', error);
                }finally {
                    setIsLoading(false); // Set loading to false when fetch completes
                }
            } else {
                console.log("EMAIL HAVEN'T PASS IN YET");
            }
        };
        fetchUserDetails();
    }, [email]);

    // Fetch ticket data by ticketId
    useEffect(() => {
        const fetchTicket = async () => {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/tickets/${ticketId}`); // Fetch ticket using ticketId
                if (response.ok) {
                    const data = await response.json(); // Parse the response as JSON
                    console.log(data);
                    setTicket(data); // Set the ticket data
                    setTicketStatus(data.status); // Set the ticket's current status
                } else {
                    console.error('Error fetching ticket:', response.statusText);
                }
            } catch (error) {
                setError("Server Error: Please Refresh the Page")
                console.error('Error fetching ticket:', error);
            }finally{
                setIsLoading(false)
            }
        };
        fetchTicket();
    }, [ticketId]);

    const handleDeleteTicket = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/tickets/${ticketId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                navigate("/dashboard"); // Redirect after deletion
            } else {
                alert('Failed to delete ticket');
            }
        } catch (error) {
            setError("Server Error: Please Try Again")
            console.error('Error deleting the ticket:', error);
        }finally{
            setIsLoading(false)
        }
    };

    const handleAssignToMeTicket = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/tickets/${ticketId}/assign`, {
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
            setError("Server Error: Please Try Again")
            console.error('Error assigning the ticket:', error);
        }finally{
            setIsLoading(false)
        }
    };

    const handleUpdateTicket = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/tickets/${ticketId}/status`, {
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
            setError("Server Error: Please Try Again")
            console.error('Error updating the ticket status:', error);
        }finally{
            setIsLoading(false)
        }
    };

    const handleRemoveTicket = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/tickets/${ticketId}/assign`, {
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
            setError("Server Error: Please Try Again")
            console.error('Error removing the ticket:', error);
        }finally{
            setIsLoading(false)
        }
    };

    function handleStatusChange(event) {
        setTicketStatus(event.target.value); // Update the status state
    }

    return (
      <>
        <CustomerSupportHeader />
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
          {/* Main content */}
          <div style={{ flex: 1, padding: '40px' }}>
            {error && (
              <div className="alert alert-danger" role="alert" style={{ borderRadius: '8px' }}>
                {error}
              </div>
            )}
    
            {isLoading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-2">Loading...</p>
              </div>
            ) : ticket ? (
              <div
                style={{
                  maxWidth: '700px',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '30px',
                  margin: '0 auto',
                }}
              >
                <h3 className="mb-4" style={{ color: '#6b705c' }}>Ticket Details</h3>
    
                <p><strong>Name:</strong> {ticket.user}</p>
                <p><strong>Description:</strong> {ticket.description}</p>
                <p><strong>Assignee:</strong> {ticket.assignee}</p>
                <p><strong>Created:</strong> {ticket.created}</p>
    
                <Form.Group controlId="formTicketStatus" className="mb-3">
                  <Form.Label><strong>Ticket Status:</strong></Form.Label>
                  <Form.Control
                    as="select"
                    disabled={ticketStatus === "Open"}
                    value={ticketStatus}
                    onChange={handleStatusChange}
                    style={{
                      fontSize: '16px',
                      padding: '10px',
                      borderRadius: '8px',
                      borderColor: '#a5a58d',
                      backgroundColor: '#f0efeb',
                    }}
                  >
                    {ticketStatus === "Open" && <option value="Open">Open</option>}
                    <option value="In Progress">In Progress</option>
                    <option value="Close">Close</option>
                  </Form.Control>
                </Form.Group>
    
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <Button
                    onClick={handleDeleteTicket}
                    variant="danger"
                    style={{
                      borderRadius: '20px',
                      padding: '10px 20px',
                      fontSize: '16px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    Delete
                  </Button>
    
                  {ticketStatus === "Open" ? (
                    <Button
                      onClick={handleAssignToMeTicket}
                      variant="outline-secondary"
                      style={{
                        borderRadius: '20px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      Assign to me
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleUpdateTicket}
                        variant="outline-secondary"
                        style={{
                          borderRadius: '20px',
                          padding: '10px 20px',
                          fontSize: '16px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Update Ticket
                      </Button>
                      <Button
                        onClick={handleRemoveTicket}
                        variant="outline-secondary"
                        style={{
                          borderRadius: '20px',
                          padding: '10px 20px',
                          fontSize: '16px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Remove My Name
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </>
    );
  }
