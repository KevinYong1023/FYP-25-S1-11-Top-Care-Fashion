import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Table, Button, Form, Card, Pagination, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersDashboard() {
    const { setUserEmail } = useContext(AuthContext); 
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const navigate = useNavigate();
    const [error, setError] = useState("")

    // Fetch users from the backend with search and filter status
    const fetchUsers = async (query = '', status = '') => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user/search?name=${query}&status=${status}`);
            const data = await response.json();

            // Filter users by position 'user' and selected status if specified
            const filteredData = data.filter(user => user.position === "user");

            setUsers(filteredData); // Set filtered users in state
        } catch (error) {
            setError("Server Error: Please Refresh the Page.")
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // Fetch users on component mount
    }, []); 

    // Filter users based on search query (filter by username or name) and status
    const handleSearch = () => {
        fetchUsers(searchQuery, filterStatus); // Fetch users based on search and status
    };

    // Reset search and filter
    const resetFilters = () => {
        setSearchQuery('');
        setFilterStatus('');
        fetchUsers(); // Fetch original list without filters
    };

    // Pagination logic
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

    // Update user status function
    const handleStatus = async (userEmail, status) => {
        try {
            setIsLoading(true);
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
                console.error("Error update status user");
            }
        } catch (error) {
            setError("Server Error: Please Try Again")
            console.error("Error update status user:", error);
        } finally {
            setIsLoading(false);
        }
    };

    function checkUserProducts(mail) {
        setUserEmail(mail);
        navigate("/managerusersindividual");
    }

    return (
        <>
          <ManagerHeader />
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
      
              {isLoading ? (
                <div className="text-center mt-5">
                  <Spinner animation="border" role="status" variant="primary" />
                  <p className="mt-2">Loading...</p>
                </div>
              ) : (
                <>
                  <h2 style={{ color: '#6e4f37' }}>User Accounts</h2>
                  <hr />
      
                  {/* Filter Section */}
                  <div
                    className="shadow-sm p-3 mb-4 rounded"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #ddd',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div className="row align-items-center">
                      <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <Form.Control
                          type="text"
                          placeholder="Search by Full Name"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-4 mb-2 mb-md-0">
                        <Form.Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                        </Form.Select>
                      </div>
                      <div className="col-12 col-md-4 d-flex justify-content-md-end gap-2">
                        <Button variant="primary" size="lg"
                        style={{ fontSize: '16px', backgroundColor: '#87986a', borderColor: '#87986a' }} onClick={handleSearch}>
                          Search
                        </Button>
                        <Button variant="secondary" size="lg"
                        style={{ fontSize: '16px' }} onClick={resetFilters}>
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
      
                  {/* User Table */}
                  <Table
                    className="table table-hover table-striped"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <thead style={{ backgroundColor: '#a5a58d', color: '#ffffff' }}>
                      <tr>
                        <th style={{ backgroundColor: "#6b705c", color: "white" }}>Name</th>
                        <th style={{ backgroundColor: "#6b705c", color: "white" }}>Username</th>
                        <th style={{ backgroundColor: "#6b705c", color: "white" }}>Email</th>
                        <th style={{ backgroundColor: "#6b705c", color: "white" }}>Phone</th>
                        <th style={{ backgroundColor: "#6b705c", color: "white" }}>Created At</th>
                        <th style={{ backgroundColor: "#6b705c", color: "white" }}>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((user) => (
                          <tr key={user.userId}>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone.slice(0, 8)}</td>
                            <td>{new Date(user.joined).toLocaleDateString('en-GB')}</td>
                            <td>{user.status}</td>
                            <td className="text-center">
                              {user.status !== 'Active' ? (
                                <Button
                                  variant="success"
                                  size="lg"
                                  style={{ fontSize: '16px' }}
                                  className="me-2"
                                  onClick={() => handleStatus(user.email, 'Active')}
                                >
                                  Activate
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    variant="danger"
                                    className="me-2"
                                    size="lg"
                                    style={{ fontSize: '16px', backgroundColor: '#ef233c', borderColor: '#ef233c' }}
                                    onClick={() => handleStatus(user.email, 'Suspended')}
                                  >
                                    Suspend
                                  </Button>
                                  <Button
                                    variant="primary"
                                    size="lg"
                                    style={{ fontSize: '16px', backgroundColor: '#87986a', borderColor: '#87986a' }}
                                    onClick={() => checkUserProducts(user.email)}
                                  >
                                    Review
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
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
