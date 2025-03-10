import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Logout() {
    return (
        <>
            {/* Header with black background and centered logo */}
            <header className="bg-dark py-2">
                <Container fluid>
                    <Row>
                        <Col className="text-center">
                            <img src='' alt="LOGO"/>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* Centered content with logout message and login button */}
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Row>
                    <Col className="text-center">
                        <h1>You have successfully logged out.</h1>
                        <br/>
                        <Button variant="primary" href="/login">Login</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}