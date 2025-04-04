import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';
import '../../css/ViewUsers.css';  // Import the CSS file

export default function ViewUsers() {
    const [users, setUsers] = useState([]);

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users'); // Fetch users from backend route
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
            <AuthorityHeader />
            <Container fluid>
                <Row className="d-flex">
                    {/* Main Content */}
                    <Col xs={12} style={{ padding: '20px' }}> {/* Set to 12 to span full width */}
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
                    </Col>
                </Row>
            </Container>
        </>
    );
}
