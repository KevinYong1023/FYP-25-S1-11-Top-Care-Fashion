import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Button, Form, Table, Card, Pagination, Spinner } from 'react-bootstrap';
import AdminHeader from '../../Components/Headers/AdminHeader';

export default function ViewAccounts() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [error, setError] = useState("")
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
            setIsLoading(true);
            const response = await fetch('/api/user');
            const data = await response.json();
            const filteredData = data.filter(user => user.email !== email); // Avoid showing the current admin
            setUsers(filteredData);
        } catch (error) {
            setError("Server Error, Please Refresh the Page")
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
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

    // Reset search
    const handleReset = () => {
        setSearchQuery('');
        setFilterPosition('');
        setFilterStatus('');
        fetchUsers(); // Fetch all users again
    };

    // Filter users by position and status
    const handleFilter = async () => {
        const query = new URLSearchParams();
        if (filterPosition) query.append('position', filterPosition);
        if (filterStatus) query.append('status', filterStatus);

        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/filter?${query.toString()}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError("Server Error: Please Try Again");
            console.error('Error filtering users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Suspend user function
    const handleStatus = async (email, status) => {
        try {
            setIsLoading(true);
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
            setError("Server Error: Please Try Again");
            console.error("Error suspending user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete user function
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
           <>
                <AdminHeader />
                <div style={{ display: 'flex', minHeight: '100vh' }}>
                 
            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
      
              {isLoading ? (
                <div className="text-center" style={{ marginTop: '100px' }}>
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Loading</span>
                  </Spinner>
                  <p className="mt-2">Loading...</p>
                </div>
              ) : (
                <>
                  <h2>User Accounts</h2>
      
                  {/* Filter and Search Form */}
                  <Card className="mb-4 shadow-sm">
                    <Card.Body>
                      <Form>
                        <div
                          className="mb-3"
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '20px',
                            justifyContent: 'space-between',
                          }}
                        >
                          {/* Search by Name */}
                          <div style={{ flex: '1 1 220px' }}>
                            <Form.Label>Search by Name:</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter name"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
      
                          {/* Filter by Position */}
                          <div style={{ flex: '1 1 220px' }}>
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
                          </div>
      
                          {/* Filter by Status */}
                          <div style={{ flex: '1 1 220px' }}>
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
                          </div>
      
                          {/* Buttons */}
                          <div
                            style={{
                              flex: '1 1 220px',
                              display: 'flex',
                              alignItems: 'flex-end',
                              gap: '10px',
                            }}
                          >
                            <Button variant="primary" onClick={handleSearch}>
                              Search
                            </Button>
                            <Button variant="secondary" onClick={handleReset}>
                              Reset
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
      
                  {/* Users Table */}
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                      <th>Name</th><th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Position</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr key={user.userId}>
                          <td>{user.name}</td> <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone.slice(0, 8)}</td>
                          <td>{user.position}</td>
                          <td>{new Date(user.joined).toLocaleDateString('en-GB')}</td>
                          <td>{user.status}</td>
                          <td>
                            {user.status === 'Active' ? (
                              <Button
                                variant="warning"
                                onClick={() => handleStatus(user.email, 'Suspended')}
                                className="me-2"
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                onClick={() => handleStatus(user.email, 'Active')}
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
                </>
              )}
            </div>
          </div>
        </>
      );
      
}
