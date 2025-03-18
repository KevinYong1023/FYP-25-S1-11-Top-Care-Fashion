// Pages/ManagerUsersDashboard.js
import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersDashboard() {
    // Mock user data
    const [users, setUsers] = useState([
        { id: "USR001", username: "john_doe", email: "john@example.com", phone: "123-4567", dateJoined: "01/02/2023" },
        { id: "USR002", username: "jane_smith", email: "jane@example.com", phone: "987-6543", dateJoined: "15/04/2023" },
        { id: "USR003", username: "mark_lee", email: "mark@example.com", phone: "555-6789", dateJoined: "22/06/2023" },
        { id: "USR004", username: "sara_k", email: "sara@example.com", phone: "321-8765", dateJoined: "10/08/2023" },
        { id: "USR005", username: "tom_h", email: "tom@example.com", phone: "654-9876", dateJoined: "05/10/2023" }
    ]);

    // State for search input
    const [searchQuery, setSearchQuery] = useState("");

    // Handle search filtering
    const filteredUsers = users.filter(user =>
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Suspend user function
    const handleSuspend = () => {
        alert("Account suspended");
    };

    return (
        <Container fluid>
            <ManagerHeader />

            <Row>
                {/* Sidebar */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: "100vh" }}>
                    <ManagerSidebar />
                </Col>

                {/* Main Content */}
                <Col md={9} lg={10} className="px-md-4">
                    <Row className="mt-3">
                        <Col>
                            <h2>User Account</h2>
                        </Col>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                placeholder="Search by ID or Username"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Table striped bordered hover className="mt-3">
                        <thead className="table-light">
                            <tr>
                                <th>Account ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Created On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.dateJoined}</td>
                                    <td>
                                        <Button variant="danger" size="sm" className="me-2" onClick={handleSuspend}>
                                            Suspend
                                        </Button>
                                        <Link to={`/managerusersindividual/${user.id}`} className="btn btn-primary btn-sm">
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}