import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserHeader from '../Components/Headers/userHeader';
import '../css/UserProfile.css'; // Import CSS file

export default function UserProfile(loginStatus) {
    return (
        <>
           <UserHeader loginStatus={loginStatus}/>
            <Container fluid>
                <Row className="d-flex justify-content-center">
                    <Col md={8} className="profile-container">
                        <Row>
                            <h2>Profile</h2>
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

                        {/* Shipping Details */}
                        <Row>
                            <h2>Shipping Details</h2>
                            <hr />
                            <Col md={6}>
                                <p><strong>First Name: Tricia</strong></p>
                                <p><strong>Last Name: Chan</strong></p>
                                <p><strong>Phone No.: 90845365</strong></p>
                                <p><strong>Email: triciachanqy@gmail.com</strong></p>
                            </Col>
                            <Col md={6}>
                                <p><strong>Address:</strong></p>
                                <p><strong>Hougang Avenue 4 Block 576</strong></p>
                                <p><strong>#08-608</strong></p>
                                <p><strong>Postal Code: 533567</strong></p>
                            </Col>
                        </Row>

                        {/* Buttons Section */}
                        <Row className="button-container">
                            <Col md={6} className="button-group">
                                <a href="/update-account"  rel="noopener noreferrer">
                                    <button className="profile-button">Update Profile</button>
                                </a>
                                <a href="/shipping-detail"  rel="noopener noreferrer">
                                    <button className="profile-button">Update Shipping Details</button>
                                </a>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
