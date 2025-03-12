import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import { Link } from 'react-router-dom'; // Import Link from React Router
import tickets from "../../mockdata/ticket.json"; // Ticket Mock Data

export default function TotalTicket({ name }) {
    const [ticketList, setTicketList] = useState(tickets);

    // Filter assigned tickets and non-closed tickets
    const assignedTickets = ticketList.filter(
        (ticket) => ticket.assigned === "Dasya Sokill" && ticket.status !== "close"
    );
   
     // Function to handle deletion of a ticket
     function handleDelete(id) {
        // Filter out the ticket that needs to be deleted
        const updatedTickets = ticketList.filter((ticket) => ticket.id !== id);
        setTicketList(updatedTickets); // Update the state with the new list
    }

    function removeAssign(id){
        alert("You have removed as ticket assignee");
        const updatedTickets = ticketList.filter((ticket) => ticket.assigned === "");
        setTicketList(updatedTickets); // Update the state with the new list
    }

    return (
        <>
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
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {console.log(name)}
                                {assignedTickets.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.desc}</td>
                                        <td>{row.status}</td>
                                        <td>
                                            {/* Using Link to pass ticket ID to TicketInfo */}
                                            <Link to={`/ticket-info/${row.id}`} rel="noopener noreferrer">
                                                Review
                                            </Link>
                                            <br />
                                            <button
                                                onClick={() => handleDelete(row.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'red',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => removeAssign(row.id)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'red',
                                                    textDecoration: 'underline',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            >
                                                Remove Ticket
                                            </button>
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
