// Pages/ManagerDashboard.js
import React, { useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar"; 
import { Link } from "react-router-dom"; // React Router for navigation
import ManagerHeader from "../../Components/Headers/ManagerHeader"; 

export default function ManagerDashboard() {
    // Mock Data
    const [dashboardData] = useState({
        totalUsers: 1000,
        activeNow: 100,
        customerFeedback: "Great quality!, Very comfortable., Looks stylish!",
        popularCategories: "Footwear",
        newUser: "igovey0 , john_doe, jane_smith, mark_lee, sara_k, tom_h", 
    });

    return (
        <Container fluid>
            <ManagerHeader />
            
            <Row>
                {/* Sidebar */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                    <ManagerSidebar />
                </Col>

                {/* Main Dashboard Content */}
                <Col md={9} lg={10} className="px-md-4">
                    <h2 className="mt-3">Manager Dashboard</h2>
                    <Row className="g-3">
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Total Users</h5>
                                <p>{dashboardData.totalUsers}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Active Now</h5>
                                <p>{dashboardData.activeNow}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Customer Feedback</h5>
                                <p>{dashboardData.customerFeedback}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Popular Categories</h5>
                                <p>{dashboardData.popularCategories}</p>
                            </Card>
                        </Col>
                        <Col md={12}>
                            <Card className="p-3">
                                <h5>New User</h5>
                                <p>{dashboardData.newUser}</p>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}