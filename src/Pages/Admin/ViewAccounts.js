import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import AdminSidebar from '../../Components/Sidebars/AdminSidebar';
import AdminHeader from '../../Components/Headers/AdminHeader';

export default function ViewAccounts() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchUsers(); // Fetch all users on load
    }, []);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
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

    // Activate user function
    const handleActive = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Active" }),
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                console.error("Error activating user");
            }
        } catch (error) {
            console.error("Error activating user:", error);
        }
    };

    // Suspend user function
    const handleSuspend = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "Suspended" }),
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
    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`/api/user/${userId}`, {
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
                    <Col xs={12} md={2} id="AdminSidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <AdminSidebar />
                    </Col>
                    <Col md={10} style={{ padding: '20px' }}>
                        <h2>View Accounts</h2>
                        <Form className="mb-3">
                            <Form.Group as={Row}>
                                <Col md={4}>
                                    <Form.Label>Search by Name:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button variant="primary" onClick={handleSearch} className="mt-2">Search</Button>
                                </Col>
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
                                    <Button variant="primary" onClick={handleFilter} className="mt-2">Filter</Button>
                                </Col>
                            </Form.Group>
                        </Form>
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
                                {users.map((user) => (
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
                                                    onClick={() => handleSuspend(user.userId)}
                                                    className="me-2"
                                                >
                                                    Suspend
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    onClick={() => handleActive(user.userId)}
                                                    className="me-2"
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDelete(user.userId)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
