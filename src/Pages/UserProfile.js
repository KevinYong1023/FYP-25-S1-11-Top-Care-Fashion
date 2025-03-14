import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserHeader from '../Components/Headers/userHeader';

export default function UserProfile() {
    return (
        <>
            <UserHeader /> {/* ✅ Include the header at the top */}
            <Container fluid>
                <Row className="d-flex justify-content-center">
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

                        {/* Buttons Section */}
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <a href="/update-account" target="_blank" rel="noopener noreferrer">
                                <button>Update Profile</button>
                            </a>
                            <a href="/shipping-detail" target="_blank" rel="noopener noreferrer">
                                <button>Edit Shipping Details</button>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
