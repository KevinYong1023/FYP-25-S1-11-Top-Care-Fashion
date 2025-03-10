import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/CustomerSupport/Sidebar';
import Header from '../../Components/CustomerSupport/Header';

export default function ViewUsers() {
    const tableData = [
        {
            id: 1,
            name: 'John Doe',
            email: 'user123@gmail.com',
            phone:12345678,
            created:"01/01/2025",
            action: "/order-history"
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'user123@gmail.com',
            phone:12345678,
            created:"01/01/2025",
            action: "/order-history"        },
        {
            id: 3,
            name: 'Alice Johnson',
            email: 'user123@gmail.com',
            phone:12345678,
            created:"01/01/2025",
            action: "/order-history"        },
        {
            id: 4,
            name: 'Bob Brown',
            email: 'user123@gmail.com',
            phone:12345678,
            created:"01/01/2025",
            action: "/order-history"        
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
                        <Col md={10} style={{ padding: '20px' }}>
                        <div>
                            Search: <input type='text'/>
                        </div>
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Account ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Created on</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.name}</td>
                                        <td>{row.email}</td>
                                        <td>{row.phone}</td>
                                        <td>{row.created}</td>
                                        <td>
                                            <a href={row.action} target="_blank" rel="noopener noreferrer">
                                                Order History
                                            </a> 
                                            
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
                        </Col>
   
                    {/* Main Content */}
                      </Row>
                                </Container>
                            </>
                        );
                    }
                    