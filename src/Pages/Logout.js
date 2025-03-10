import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export default function Logout({ setIsLoggedIn }) {  // Accept setIsLoggedIn as a prop
    const navigate = useNavigate();

    useEffect(()=>{
        setIsLoggedIn(false);  // Set login state to false
    })

    const handleLogout = () => {
        navigate("/login");  // Redirect to login page
    };

    return (
        <>
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Row>
                    <Col className="text-center">
                        <h1>You have successfully logged out.</h1>
                        <br/>
                        <Button variant="primary" onClick={handleLogout}>Login</Button> {/* Logout and redirect to login */}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
