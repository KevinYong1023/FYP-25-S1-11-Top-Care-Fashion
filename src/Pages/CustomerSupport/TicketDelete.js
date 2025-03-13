import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';

export default function TicketDelete() {
    return (
        <>
        <AuthorityHeader/>

            {/* Centered content with logout message and login button */}
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Row>
                    <Col className="text-center">
                        <h1>You have deleted this ticket.</h1>
                        <br/>
                        <Button variant="primary" href="/dashboard">Back to Dashboard</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}