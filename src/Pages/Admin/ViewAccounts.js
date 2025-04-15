import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Button, Form, Table, Card, Pagination, Spinner } from 'react-bootstrap';
import AdminHeader from '../../Components/Headers/AdminHeader';
import '../../css/ViewAccounts.css';

export default function ViewAccounts() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const { email } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, [email]);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/user');
            const data = await response.json();
            const filteredData = data.filter(user => user.email !== email);
            setUsers(filteredData);
        } catch (error) {
            setError("Server Error, Please Refresh the Page");
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/search?name=${searchQuery}&status=${filterStatus}&position=${filterPosition}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError("Server Error: Please Try Again");
            console.error('Error searching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSearchQuery('');
        setFilterPosition('');
        setFilterStatus('');
        fetchUsers();
    };

    const handleStatus = async (email, status) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/${email}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                console.error("Error updating status");
            }
        } catch (error) {
            setError("Server Error: Please Try Again");
            console.error("Error updating status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (email) => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/${email}`, {
                method: "DELETE",
            });

            if (response.ok) {
                await fetchUsers();
            } else {
                console.error("Error deleting user");
            }
        } catch (error) {
            setError("Server Error: Please Try Again");
            console.error("Error deleting user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AdminHeader />
            <Container fluid className="p-4">
                {error && <div className="alert alert-danger">{error}</div>}

                {isLoading ? (
                    <div className="text-center loading-container">
                        <Spinner animation="border" role="status" variant="primary">
                            <span className="visually-hidden">Loading</span>
                        </Spinner>
                        <p className="mt-2">Loading...</p>
                    </div>
                ) : (
                    <>
                        <h2>User Accounts</h2>

                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Form>
                                    <Row className="mb-3">
                                        <Col md={3}>
                                            <Form.Label>Search by Name:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter name"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </Col>

                                        <Col md={3}>
                                            <Form.Label>Filter by Position:</Form.Label>
                                            <Form.Select
                                                value={filterPosition}
                                                onChange={(e) => setFilterPosition(e.target.value)}
                                            >
                                                <option value="">All</option>
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                                <option value="customer support">Customer Support</option>
                                                <option value="manager">Manager</option>
                                            </Form.Select>
                                        </Col>

                                        <Col md={3}>
                                            <Form.Label>Filter by Status:</Form.Label>
                                            <Form.Select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                            >
                                                <option value="">All</option>
                                                <option value="Active">Active</option>
                                                <option value="Suspended">Suspended</option>
                                            </Form.Select>
                                        </Col>

                                        <Col md={3} className="d-flex align-items-end">
                                            <Button variant="primary" onClick={handleSearch} className="me-2">
                                                Search
                                            </Button>
                                            <Button variant="secondary" onClick={handleReset} className="me-2">
                                                Reset
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>

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
                                    <tr key={user.userId}>
                                        <td>{user.userId}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone?.slice(0, 8)}</td>
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

                        {renderPagination()}
                    </>
                )}
            </Container>
        </div>
    );
}
