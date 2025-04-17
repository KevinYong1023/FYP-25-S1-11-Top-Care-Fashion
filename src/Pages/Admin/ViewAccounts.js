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

      <>
        <AdminHeader />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Main Content */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: "#f0efeb" }}>
            {!error ? null : (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <h2 style={{ color: '#6e4f37', textAlign: 'center'}}>User Accounts</h2>
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
                      <Button 
                      style={{backgroundColor: '#87986a', borderColor: '#87986a' }}
                      onClick={handleSearch}>
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
            {isLoading ? (
              <div className="text-center" style={{ marginTop: '100px' }}>
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading</span>
                </Spinner>
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              <div>
                <Table
                  striped
                  bordered
                  hover
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <thead style={{ backgroundColor: '#a5a58d', color: '#ffffff' }}>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Position</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
  {currentUsers.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center">
        No users found
      </td>
    </tr>
  ) : (
    currentUsers.map((user) => ( // Removed the extra curly braces here
      <tr key={user.userId}>
        <td>{user.name}</td>
        <td>{user.username}</td>
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
              style={{ fontSize: '16px', backgroundColor: '#97a97c', borderColor: '#97a97c'}}
            >
              Suspend
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={() => handleStatus(user.email, 'Active')}
              className="me-2"
              style={{ fontSize: '16px' , backgroundColor: '#97a97c', borderColor: '#97a97c'}}
            >
              Activate
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => handleDelete(user.email)}
            style={{ fontSize: '16px' , backgroundColor: '#ef233c', borderColor: '#ef233c'}}
          >
            Delete
          </Button>
        </td>
      </tr>
    ))
  )}
</tbody>

                </Table>
    
                {/* Pagination */}
                {renderPagination()}
              </div>
            )}
          </div>

        </div>
      </>
    );
    
      
}
