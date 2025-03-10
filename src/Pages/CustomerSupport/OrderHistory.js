import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Sidebar from '../../Components/CustomerSupport/Sidebar';
import Header from '../../Components/CustomerSupport/Header';

export default function OrderHistory() {
    const tableData = [
        {
            id: 1,
            status: 'In progress',
            seller: 'user123',
            purchase:"02/01/2025",
            action: "https://www.google.com/"
        },
        {
            id: 2,
            status: 'In progress',
            seller: 'user123',
            purchase:"02/01/2025",
            action: "https://www.google.com/"
        },
        {
            id: 3,
            status: 'In progress',
            seller: 'user123',
            purchase:"02/01/2025",
            action: "https://www.google.com/"
        },
        {
            id: 4,
            status: 'In progress',
            seller: 'user123',
            purchase:"02/01/2025",
            action: "https://www.google.com/"
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
                                <th>Invoice ID</th>
                                <th>Status</th>
                                <th>Seller</th>
                                <th>Date Purchase</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row) => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.status}</td>
                                        <td>{row.seller}</td>
                                        <td>{row.purchase}</td>
                                        <td>
                                            <a href={row.action} target="_blank" rel="noopener noreferrer">
                                               Review
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
                    