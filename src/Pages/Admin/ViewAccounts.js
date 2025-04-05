import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Button, Form, Table, Card, Pagination } from 'react-bootstrap';
import AdminSidebar from '../../Components/Sidebars/AdminSidebar';
import AdminHeader from '../../Components/Headers/AdminHeader';

export default function ViewAccounts() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const usersPerPage = 10; // Number of users per page
    const { email } = useContext(AuthContext); 
    

    useEffect(() => {
        fetchUsers(); // Fetch all users on load
    }, [email]);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            const filteredData = data.filter(user => user.email !== email); // Avoid showing the current admin
            setUsers(filteredData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

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

    // Search users by name
    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/user/search?name=${searchQuery}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    // Filter users by position and status
    const handleFilter = async () => {
        const query = new URLSearchParams();
        if (filterPosition) query.append('position', filterPosition);
        if (filterStatus) query.append('status', filterStatus);

        try {
            const response = await fetch(`/api/user/filter?${query.toString()}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error filtering users:', error);
        }
    };

    // Suspend user function
    const handleStatus = async (email, status) => {
        try {
            const response = await fetch(`/api/user/${email}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: status }),
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                console.error("Error suspending user");
            }
        } catch (error) {
            console.error("Error suspending user:", error);
        }
    };

    // Delete user function
    const handleDelete = async (email) => {
        try {
            const response = await fetch(`/api/user/${email}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                console.error("Error deleting user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div>
            <AdminHeader />
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar */}
                    <Col xs={12} md={2} id="AdminSidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <AdminSidebar />
                    </Col>

                    {/* Main Content */}
                    <Col md={10} style={{ padding: '20px' }}>
                        <h2>View Accounts</h2>

                        {/* Filter and Search Form */}
                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Form>
                                    <Row className="mb-3">
                                        {/* Search by Name */}
                                        <Col md={4}>
                                            <Form.Label>Search by Name:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Button variant="primary" onClick={handleSearch} className="mt-2 w-100">Search</Button>
                                        </Col>

                                        {/* Filter by Position */}
                                        <Col md={4}>
                                            <Form.Label>Filter by Position:</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={filterPosition}
                                                onChange={(e) => setFilterPosition(e.target.value)}
                                            >
                                                <option value="">All</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                                <option value="customer support">Customer Support</option>
                                                <option value="manager">Manager</option>
                                            </Form.Control>
                                        </Col>

                                        {/* Filter by Status */}
                                        <Col md={4}>
                                            <Form.Label>Filter by Status:</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                            >
                                                <option value="">All</option>
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                            </Form.Control>
                                            <Button variant="primary" onClick={handleFilter} className="mt-2 w-100">Filter</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Users Table */}
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Account ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.userId}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone.slice(0, 8)}</td>
                                        <td>{user.position}</td>
                                        <td>{user.status}</td>
                                        <td>
                                            {user.status === 'Active' ? (
                                                <Button
                                                    variant="warning"
                                                    onClick={() => handleStatus(user.email, "Suspended")}
                                                    className="me-2"
                                                >
                                                    Suspend
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleStatus(user.email, "Active")}
                                                    className="me-2"
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(user.email)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        {renderPagination()}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
