import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/Sidebar';
import { Link } from 'react-router-dom'; // Import Link from React Router
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';

export default function TotalTicket({email}) {
    const [ticketList, setTicketList] = useState([]);
    const [userName, setUserName] = useState(""); // State to store user name

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
            }else{
                console.log("EMAIL HAVENT PASS IN YET") // THE LOG SHOWED THIS
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
                        // Filter by assignee and exclude tickets with status "Closed"
                        const filteredData = data.filter(ticket => ticket.assignee === userName && ticket.status !== 'Close');
                        setTicketList(filteredData); // Update the ticket list
                    } else {
                        console.error('Failed to fetch tickets');
                    }
                } catch (error) {
                    console.error('Error fetching tickets:', error);
                }
            }
        };
        fetchAssignedTickets();
    }, [userName]); // Run this effect when userName is set
    


  // Function to handle deletion of a ticket
    async function handleDelete(id) {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // Update ticket list after deleting the ticket using _id
                const updatedTickets = ticketList.filter((ticket) => ticket._id !== id);
                setTicketList(updatedTickets);
                alert('Ticket deleted successfully');
            } else {
                alert('Failed to delete the ticket');
            }
        } catch (error) {
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
            // Remove the ticket from the list if the assignee is cleared
            const updatedTickets = ticketList.filter((ticket) => ticket._id !== ticketId);
            setTicketList(updatedTickets); // Update the ticket list by removing the ticket
            alert('Ticket assignment removed successfully');
        } else {
            alert('Failed to remove assignment');
        }
    } catch (error) {
        console.error('Error updating the ticket:', error);
    }
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
                    <Col>
                    <h2>Your Tickets</h2>
                    <hr/>
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
                                {ticketList.map((row,index) => (
                                    <tr key={row._id}>
                                        <td>{index+1}</td>
                                        <td>{row.user}</td>
                                        <td>{row.status}</td>
                                                                                <td>
                                            {/* Using Link to pass ticket ID to TicketInfo */}
                                            <div className="d-flex gap-2">
                                                <Link to={`/ticket-info/${row._id}`} rel="noopener noreferrer">
                                                    <Button variant="primary" size="sm">Review</Button>
                                                </Link>

                                                {/* Delete Ticket Button */}
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(row._id)}
                                                >
                                                    Delete
                                                </Button>

                                                {/* Remove Ticket Button */}
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
                    </Col>
                </Row>
            </Container>
        </>
    );
}
