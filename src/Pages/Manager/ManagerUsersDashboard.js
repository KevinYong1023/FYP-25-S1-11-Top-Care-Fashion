import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Table, Button, Form, Card, Pagination, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
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
    }, []); // Empty dependency array, run once on mount

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
                                {/* Sidebar */}
                                <div style={{ width: '250px', flexShrink: 0 }}>
                                    <ManagerSidebar />
                                </div>
                                {/* Main Content */}
            <div style={{ flex: '1', padding: '40px' }}>
                {!error ? <></> : (
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
                        {/* Filter Section */}
<div className="mb-4">
    <div 
        className="shadow-sm p-3 mb-4 rounded" 
        style={{ backgroundColor: '#fff', border: '1px solid #ddd' }} // Adding border style here
    >
        <div className="row align-items-center">
            <div className="col-12 col-md-4">
                <Form.Control
                    type="text"
                    placeholder="Search by Full Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="col-12 col-md-4">
                <Form.Control
                    as="select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                </Form.Control>
            </div>
            <div className="col-12 col-md-4 d-flex">
                <Button
                    variant="primary"
                    className="me-2"
                    onClick={handleSearch}
                >
                    Search
                </Button>
                <Button
                    variant="secondary"
                    onClick={resetFilters}
                >
                    Reset
                </Button>
            </div>
        </div>
    </div>
</div>


                        {/* User Table */}
                        <table className="table table-striped table-bordered mt-3">
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
                                {currentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center">No users found</td>
                                    </tr>
                                ) : (
                                    currentUsers.map((user) => (
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
                                                        onClick={() => handleStatus(user.email, "Active")}
                                                    >
                                                        Activate
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            className="me-2"
                                                            onClick={() => handleStatus(user.email, "Suspended")}
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
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Pagination for Users */}
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
        </>
    );
}
