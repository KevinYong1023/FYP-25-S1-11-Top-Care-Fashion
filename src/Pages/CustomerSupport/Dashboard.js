// Pages/Dashboard.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/CustomerSupport/Sidebar';
import Header from '../../Components/CustomerSupport/Header';

export default function Dashboard() {
    const tableData = [
        {
            id: 1,
            name: 'John Doe',
            description: 'This is a sample description for John.',
            status:"open",
            review: "/ticket-info",
            delete:"/ticket-deleted"
        },
        {
            id: 2,
            name: 'Jane Smith',
            description: 'This is a sample description for Jane.',
            status:"open",
             review: "/ticket-info",
            delete:"/ticket-deleted"
        },
        {
            id: 3,
            name: 'Alice Johnson',
            description: 'This is a sample description for Alice.',
            status:"open",
             review: "/ticket-info",
            delete:"/ticket-deleted"
        },
        {
            id: 4,
            name: 'Bob Brown',
            description: 'This is a sample description for Bob.',
            status:"open",
            review: "/ticket-info",
            delete:"/ticket-deleted"
        }
    ];
    return (
        <>
            {/* Universal Header */}
            <Header />

            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar - fixed width, no padding */}
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>

                    {/* Main Content */}
                    <Col style={{ margin: '10px' }}>
                        <h1>Welcome Kevin</h1>
                        <p>Following are the tickets</p>
                        <hr/>
                        <div>
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.description}</td>
                                        <td>{row.status}</td>
                                        <td>
                                            <a href={row.delete} target="_blank" rel="noopener noreferrer">
                                                delete
                                            </a> 
                                            <br/>
                                            <a href={row.review} target="_blank" rel="noopener noreferrer">
                                                review
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
