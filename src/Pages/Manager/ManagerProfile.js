// Pages/ManagerProfile.js
import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerProfile() {
    // Mock Data
    const [profileData] = useState({
        fullName: "John Doe",
        email: "johndoe@example.com",
        dob: "1990-05-15",
        idNumber: "MGR001",
        dateJoined: "2022-01-10",
        gender: "Male",
        phone: "+1234567890",
        position: "Manager",
    });

    return (
        <Container fluid>
            <ManagerHeader />
            
            <Row>
                {/* Sidebar */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: "100vh" }}>
                    <ManagerSidebar />
                </Col>

                {/* Main Profile Content */}
                <Col md={9} lg={10} className="px-md-4">
                    <h2 className="mt-3">Manager Profile</h2>
                    <Card className="p-4">
                        <Row>
                            <Col md={6}>
                                <h5>Full Name</h5>
                                <p>{profileData.fullName}</p>
                            </Col>
                            <Col md={6}>
                                <h5>Email</h5>
                                <p>{profileData.email}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <h5>Date of Birth</h5>
                                <p>{profileData.dob}</p>
                            </Col>
                            <Col md={6}>
                                <h5>ID Number</h5>
                                <p>{profileData.idNumber}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <h5>Date Joined</h5>
                                <p>{profileData.dateJoined}</p>
                            </Col>
                            <Col md={6}>
                                <h5>Gender</h5>
                                <p>{profileData.gender}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <h5>Phone Number</h5>
                                <p>{profileData.phone}</p>
                            </Col>
                            <Col md={6}>
                                <h5>Position</h5>
                                <p>{profileData.position}</p>
                            </Col>
                        </Row>
                        <div className="text-center mt-4">
                            <Button variant="primary">Update Profile</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}