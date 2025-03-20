// Pages/Dashboard.js
import React, { useState } from 'react';
import { Container, Row, Col,Button } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/Sidebar';
import { Link } from 'react-router-dom'; // Import Link from React Router
import tickets from "../../mockdata/ticket.json"; // Ticket Mock Data
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';

export default function Dashboard() {
    // Create a local state to manage tickets (simulate ticket deletion)
    const [ticketList, setTicketList] = useState(tickets);

    // Function to handle deletion of a ticket
    function handleDelete(id) {
        // Filter out the ticket that needs to be deleted
        const updatedTickets = ticketList.filter((ticket) => ticket.id !== id);
        setTicketList(updatedTickets); // Update the state with the new list
    }

    function assignTicket(){
        alert("You have pick up this Ticket");
    }

    // Filter out tickets that are not closed
    const openTickets = ticketList.filter((ticket) => ticket.status !== "close");

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
                <Col style={{ margin: '10px' }}>
                    <h1>Welcome Dasya Sokill</h1>
                    <p>Following are the tickets</p>
                    <hr />
                    <h2>All Available Tickets</h2>
                    <a href="/assigned-ticket">Your Tickets</a>
                    <hr/>
                    <div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Assignee</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openTickets.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.desc}</td>
                                        <td>{row.status}</td>
                                        <td>{row.assigned}</td>
                                        <td>
  {/* Using Link to pass ticket ID to TicketInfo */}
  <Link to={`/ticket-info/${row.id}`} rel="noopener noreferrer">
    <Button variant="primary" size="sm" className="mb-2">Review</Button>
  </Link>
  <br />
  {/* Delete Ticket Button */}
  <Button
    variant="danger"
    size="sm"
    onClick={() => handleDelete(row.id)}
    className="mb-2"
  >
    Delete
  </Button>
  <br />
  {/* Assign to Me Button */}
  <Button
    variant="warning"
    size="sm"
    onClick={() => assignTicket()}
  >
    Assign to me
  </Button>
</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </Container>
        </>
    );
}
