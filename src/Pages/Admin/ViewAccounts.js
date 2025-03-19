import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSidebar from '../../Components/Sidebars/AdminSidebar';
import userData from '../../mockdata/users.json'; // Adjust the path to your actual json file
import AdminHeader from '../../Components/Headers/AdminHeader';

export default function ViewAccounts() {
    // Filter users with the position
    const filteredUsers = userData.filter(user => user.position);

    // State to store the search query
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Function to filter users based on search query
    const filteredUsersBySearch = filteredUsers.filter((user) => {
        return (
            user.id.toString().toLowerCase().includes(searchQuery) ||
            user.name.toLowerCase().includes(searchQuery) ||
            user.position.toLowerCase().includes(searchQuery)
        );
    });

    return (
        <div>
            <AdminHeader/>
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar */}
                    <Col xs={11} md={2} id="AdminSidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <AdminSidebar />
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
                                    <th>Roles</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsersBySearch.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone.slice(0, 8)}</td> {/* Limits phone to 8 characters */}
                                        <td>{user.position}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}