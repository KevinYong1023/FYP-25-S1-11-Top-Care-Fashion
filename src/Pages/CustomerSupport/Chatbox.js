import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar'; // Assuming Sidebar component is created

export default function Chatbox() {
    return (
        <>
            <Container fluid>
                {/* Body */}
                <Row >
                    {/* Sidebar */}
                    <Col xs={2} className="p-0" style={{ backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }}>
                        <Sidebar /> {/* Display list of users */}
                    </Col>

                    {/* Main Chat Area */}
                    <Col xs={10} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <h1>Customer Name: Kevin</h1>
                    <hr/>
                        <div style={{ padding: '20px', flexGrow: 1 }}>
                            <p><strong>Kevin:</strong> This order got problem</p>
                            <p style={{ textAlign: 'right' }}><strong>Support:</strong> Hello! How can we assist you today?</p>
                            <p><strong>Kevin:</strong> Why I can't get the seller to reply to me</p>
                        </div>
                        {/* Message Input */}
                        <div style={{ padding: '10px', borderTop: '1px solid #ccc', backgroundColor: '#fafafa' }}>
                            <Form inline style={{ display: 'flex' }}>
                                <Form.Control type="text" placeholder="Message" className="mr-sm-2" style={{ flexGrow: 1, borderRadius: '20px' }} />
                                <Button variant="primary" style={{ borderRadius: '20px', marginLeft: '10px' }}>Send</Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
