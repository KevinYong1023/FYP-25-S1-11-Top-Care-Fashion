import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination,Spinner} from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/CustomerSupportSidebar';
import CustomerSupportHeader from '../../Components/Headers/CustomerSupportHeader';

export default function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const usersPerPage = 10; // Number of users per page
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [error, setError] = useState("")

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/user'); // Fetch users from backend route
                const data = await response.json();
                setUsers(data); // Set the fetched users to the state
            } catch (error) {
                setError("Server Error: Please Refresh the Page")
                console.error('Error fetching users:', error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchUsers();
    }, []);

    // Filter users with the position 'user'
    const filteredUsers = users.filter(user => user.position === 'user');

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

    return (
        <>
            <CustomerSupportHeader />
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar */}
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>

                    {/* Main Content */}
                    <Col md={10} style={{ padding: '20px' }}>
                    {!error?<></>: <div className="alert alert-danger" role="alert">
                                  {error}
                                </div>}
                    {
                        isLoading ? (
                            <div className="text-center" style={{ marginTop: '100px' }}>
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Loading</span>
                                </Spinner>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ):(<>
                        <h2>User Accounts</h2>
                        <hr />
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone.slice(0, 8)}</td> {/* Limits phone to 8 characters */}
                                        <td>
                                            <a href={`/order-history/${user.name}`} rel="noopener noreferrer">
                                                Order History
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {renderPagination()}
                        </>) }
                    </Col>
                </Row>
            </Container>
        </>
    );
}
