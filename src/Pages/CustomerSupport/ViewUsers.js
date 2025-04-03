import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/Sidebar';
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';

export default function ViewUsers() {
    const [users, setUsers] = useState([]);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user'); // Fetch users from backend route
                const data = await response.json();
                setUsers(data); // Set the fetched users to the state
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Filter users with the position 'user'
    const filteredUsers = users.filter(user => user.position === 'user');

    return (
        <>
            <AuthorityHeader/>
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar */}
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>

                    {/* Main Content */}
                    <Col md={10} style={{ padding: '20px' }}>
                        <h2>Users List</h2>
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
                                {filteredUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone.slice(0, 8)}</td> {/* Limits phone to 8 characters */}
                                        <td>
                                            <a href={`/order/${user.name}`} rel="noopener noreferrer">
                                                Order History
                                            </a>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
