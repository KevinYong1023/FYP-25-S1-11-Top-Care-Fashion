import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Table, Button, Form, Card, Pagination } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersDashboard() {
     const { setUserEmail } = useContext(AuthContext); 
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const usersPerPage = 10; // Set the number of records per page
    const navigate = useNavigate();

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/user");
            const data = await response.json();

            // Filter users by position 'user' and selected status
            const filteredData = data
                .filter(user => user.position === "user")
                .filter(user => filterStatus === '' || user.status === filterStatus); // Filter by status if specified

            setUsers(filteredData); // Set filtered users in state
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount or when filterStatus changes
    }, [filterStatus]); // Fetch users again if the status filter changes

    // Filter users based on search query (filter by username)
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

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

    // Update user status function
    const handleStatus = async (userEmail, status) => {
        try {
            const response = await fetch(`/api/user/${userEmail}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: status }), // Set status dynamically
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

    function checkUserProducts(mail) {
        setUserEmail(mail);
        navigate("/managerusersindividual");
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
                                <h2>User Accounts</h2>
                            </Col>
                        </Row>

                        {/* Filter Section */}
                        <Row className="mb-4">
                            <Col>
                                <Card className="shadow-sm p-3 mb-4 rounded">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col xs={12} md={4}>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search by Username"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </Col>
                                            <Col xs={12} md={4}>
                                                <Form.Control
                                                    as="select"
                                                    value={filterStatus}
                                                    onChange={(e) => setFilterStatus(e.target.value)}
                                                >
                                                    <option value="">All Statuses</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Suspended">Suspended</option>
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* User Table */}
                        <Table striped bordered hover className="mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
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
                                {currentUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.username}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                        <td>{new Date(user.joined).toLocaleDateString('en-GB')}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            {user.status !== "Active" ? (
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    className="me-2"
                                                    onClick={() => handleStatus(user.email, "Active")} // Activate user
                                                >
                                                    Activate
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleStatus(user.email, "Suspended")} // Suspend user
                                                    >
                                                        Suspend
                                                    </Button>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => checkUserProducts(user.email)}
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

                        {/* Pagination for Users */}
                        {renderPagination()}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
