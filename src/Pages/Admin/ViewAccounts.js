import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminSidebar from '../../Components/Sidebars/AdminSidebar';
import userData from '../../mockdata/users.json';
import AdminHeader from '../../Components/Headers/AdminHeader';
import '../../css/ViewAccounts.css';

export default function ViewAccounts() {
    const filteredUsers = userData.filter(user => user.position);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredUsersBySearch = filteredUsers.filter((user) => {
        return (
            user.id.toString().toLowerCase().includes(searchQuery) ||
            user.name.toLowerCase().includes(searchQuery) ||
            user.position.toLowerCase().includes(searchQuery)
        );
    });

    return (
        <div>
            <AdminHeader />
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={11} md={2} id="AdminSidebar" className="p-0 sidebar-container">
                        <AdminSidebar />
                    </Col>
                    <Col md={10} className="content-container">
                        <div className="search-bar">
                            <label>Search: </label>
                            <input
                                type="text"
                                onChange={handleSearchChange}
                                value={searchQuery}
                                className="search-input"
                            />
                        </div>
                        <br />
                        <table className="table table-bordered custom-table">
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
                                        <td>{user.phone.slice(0, 8)}</td>
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
