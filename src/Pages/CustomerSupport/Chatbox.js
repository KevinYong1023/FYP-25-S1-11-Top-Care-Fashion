import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';

export default function Chatbox() {
    return (
        <>
            <AuthorityHeader />
            <Container fluid>
                {/* Body */}
                <Row className="justify-content-center">
                    {/* Main Chat Area */}
                    <Col xs={12} md={8} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90vh' }}>
                        <h1 className="text-center">Customer Name: Kevin</h1>
                        <hr />
                        <div style={{ padding: '20px', flexGrow: 1, overflowY: 'auto', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                            <p><strong>Kevin:</strong> This order got problem</p>
                            <p style={{ textAlign: 'right' }}><strong>Support:</strong> Hello! How can we assist you today?</p>
                            <p><strong>Kevin:</strong> Why I can't get the seller to reply to me</p>
                        </div>

                        {/* Message Input */}
                        <div style={{ padding: '10px', borderTop: '1px solid #ccc', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                            <Form style={{ display: 'flex' }}>
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
