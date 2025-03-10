import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Sidebar from '../../Components/CustomerSupport/Sidebar';
import Header from '../../Components/CustomerSupport/Header';

export default function Profile() {
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
                        <Row>
                            <hr/>
                            <Col md={6}>
                                <p><strong>Full Name: Kevin</strong></p>
                                <p><strong>Email: kevinyong1023@gmail.com</strong></p>
                                <p><strong>D.O.B: 01/02/2000</strong></p>
                                <p><strong>ID Number: 12345678</strong></p>
                                <p><strong>Date Joined: 01/01/2024</strong></p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Gender: Male</strong></p>
                                <p><strong>Phone No.: 97865555</strong></p>
                                <p><strong>Position: Customer Support</strong></p>
                            </Col>
                            
                        </Row>
                        <div>
                        <button><a href="/profile-update" target="_blank" rel="noopener noreferrer">
                                                Edit Profile
                                            </a> </button>
                    </div>
                    </Col>
                    
                </Row>
            </Container>
        </>
    );
}
