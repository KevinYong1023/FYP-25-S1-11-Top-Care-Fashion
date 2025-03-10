import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Sidebar from '../../Components/CustomerSupport/Sidebar';
import Header from '../../Components/CustomerSupport/Header';

export default function TicketInfo(){
    return(
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
                                  <p><strong>Ticket ID: 1</strong></p>
                                  <p><strong>Name: John Doe	</strong></p>
                                  <p><strong>Description: This ticket information has multiple issues. Seller not response on faulty items. </strong></p>
                                  <p><strong>Ticket Status: Open</strong></p>
                                  <hr/>
                                  <div>
                                  <button>Chat with User</button>
                                    <button>Delete</button>
                                    <button>Solving the ticket</button>
                                    <button>Close</button>
                                  </div>
                              </Col>
                            </Row>
                        </Col>
                    </Row>
                   </Container>
                   </>
            )
}