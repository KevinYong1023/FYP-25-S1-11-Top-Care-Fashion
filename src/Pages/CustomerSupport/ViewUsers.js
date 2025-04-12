import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'; // Added Button
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';
import '../../css/ViewUsers.css';

export default function ViewUsers() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
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
            <AuthorityHeader />
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={12} style={{ padding: '20px' }}>
                        <h2 className="user-list-header">Users List</h2>
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
                                        <td>{user.phone.slice(0, 8)}</td>
                                        <td>
                                            <a href={`/order-history/${user.name}`} rel="noopener noreferrer">
                                                Order History
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Back button */}
                        <div className="text-center mt-4">
                            <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
