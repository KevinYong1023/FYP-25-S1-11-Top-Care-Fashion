import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";
import { useNavigate } from 'react-router-dom';

export default function ManagerUsersDashboard({setUserEmail}) {
    // State for storing users fetched from the API
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    // State for search input
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/user");
            const data = await response.json();
            // Filter users to only include those with position "user"
            const filteredData = data.filter(user => user.position === "user");

            setUsers(filteredData); // Set filtered users in state
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, []);

    // Filter users based on search query (filter by username)
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Suspend user function
    const handleSuspend = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "Suspended" }), // Set status to Suspended
            });

            if (response.ok) {
                await fetchUsers(); // Refetch users to refresh the list
            } else {
                console.error("Error suspending user");
            }
        } catch (error) {
            console.error("Error suspending user:", error);
        }
    };

    // Activate user function
    const handleActive = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "Active" }), // Set status to Active
            });

            if (response.ok) {
                await fetchUsers(); // Refetch users to refresh the list
            } else {
                console.error("Error activating user");
            }
        } catch (error) {
            console.error("Error activating user:", error);
        }
    };

    function checkUserProducts(mail){
        setUserEmail(mail)
        navigate("/managerusersindividual")
    }

    return (
        <>
            <ManagerHeader />
            <Container fluid>
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
                                    placeholder="Search by Username"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Col>
                        </Row>

                        <Table striped bordered hover className="mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.joined}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            {user.status !== "Active" ? (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleActive(user._id)} // Activate user
                                                >
                                                    Activate
                                                </Button>
                                            ) : (
                                                <>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleSuspend(user._id)} // Suspend user
                                                >
                                                    Suspend
                                                </Button>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() =>checkUserProducts(user.email)} // Suspend user
                                                >
                                                    Review
                                                </Button>                                            
                                                </>
                                            )}
                                          
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
