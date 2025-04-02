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
                    <Col md={10} className="profile-container">
                        <Row>
                            {/* Profile Section */}
                            <Col md={6}>
                                <h2 className="profile-heading">Profile</h2>
                                <hr />
                                <Row>
                                    <Col md={6}><p><strong>First Name:</strong> Tricia</p></Col>
                                    <Col md={6}><p><strong>Last Name:</strong> Chan</p></Col>
                                </Row>
                                <p><strong>Username:</strong> tcqy</p>
                                <p><strong>Email:</strong> triciachanqy@gmail.com</p>
                                <p><strong>Phone No.:</strong> 90845365</p>
                                <p><strong>Date Joined:</strong> 11/03/2025</p>
                            </Col>

                            {/* Shipping Details Section */}
                            <Col md={6}>
                                <h2 className="profile-heading">Shipping Details</h2>
                                <hr />
                                <Row>
                                    <Col md={6}><p><strong>First Name:</strong> Tricia</p></Col>
                                    <Col md={6}><p><strong>Last Name:</strong> Chan</p></Col>
                                </Row>
                                <p><strong>Phone No.:</strong> 90845365</p>
                                <p><strong>Email:</strong> triciachanqy@gmail.com</p>
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Address:</strong></p>
                                        <p>Hougang Avenue 4 Block 576</p>
                                        <p>#08-608</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Postal Code:</strong> 533567</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* Buttons Section */}
                        <Row className="mt-3">
                            <Col md={6} className="d-flex justify-content-center">
                                <a href="/update-account" rel="noopener noreferrer">
                                    <button className="profile-button">Update Profile</button>
                                </a>
                            </Col>
                            <Col md={6} className="d-flex justify-content-center">
                                <a href="/shipping-detail" rel="noopener noreferrer">
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
