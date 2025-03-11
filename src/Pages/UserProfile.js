import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function UserProfile() {
    return (
        <Container fluid>
            <Row className="d-flex justify-content-center">
                {/* Main Content */}
                <Col md={8} style={{ padding: "20px" }}>
                    <Row>
                        <hr />
                        <Col md={6}>
                            <p><strong>First Name: Tricia</strong></p>
                            <p><strong>Last Name: Chan</strong></p>
                            <p><strong>Username: tcqy</strong></p>
                            <p><strong>Email: triciachanqy@gmail.com</strong></p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Phone No.: 90845365</strong></p>
                            <p><strong>Date Joined: 11/03/2025</strong></p>
                        </Col>
                    </Row>
                    <div>
                        <button>
                            <a href="/update-account" target="_blank" rel="noopener noreferrer">
                                Update Profile
                            </a>
                        </button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
