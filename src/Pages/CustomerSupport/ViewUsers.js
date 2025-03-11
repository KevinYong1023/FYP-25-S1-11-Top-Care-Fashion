import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import userData from '../../mockdata/users.json'; // Adjust the path to your actual json file

export default function ViewUsers() {
    // Filter users with the position 'user'
    const filteredUsers = userData.filter(user => user.position === 'user');

    // State to store the search query
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Function to filter users based on search query (id or name)
    const filteredUsersBySearch = filteredUsers.filter((user) => {
        return (
            user.id.toString().toLowerCase().includes(searchQuery) ||
            user.name.toLowerCase().includes(searchQuery)
        );
    });

    return (
        <>
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar */}
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>
                   
                    {/* Main Content */}
                    <Col md={10} style={{ padding: '20px' }}>
                        <div>
                            Search: <input type='text' onChange={handleSearchChange} value={searchQuery} />
                        </div>
                        <br/>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Account ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsersBySearch.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone.slice(0, 8)}</td> {/* Limits phone to 8 characters */}
                                        <td>
                                            <a href="/order-history" rel="noopener noreferrer">
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