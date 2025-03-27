import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar"; 
import ManagerHeader from "../../Components/Headers/ManagerHeader"; 

export default function ManagerDashboard() {
    // State for dashboard data
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        activeNow: 0,
        suspensedNow:0,
        popularCategories: "Footwear", // Keep static or fetch if needed
    });

    // Fetch users from backend and update dashboard data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/user");
                const users = await response.json();
                const filteredUsers = users.filter(user => user.position === "user");

                const totalUsers = filteredUsers.length;

                // Count active users (assuming 'status' field contains "Active")
                const activeNow = filteredUsers.filter(user => user.status === "Active" && user.position === "user").length;
                const suspensedNow = filteredUsers.filter(user => user.status === "Suspensed").length;
                setDashboardData({
                    totalUsers,
                    activeNow,suspensedNow,
                    popularCategories: "Footwear", // Keep as is, or fetch dynamically
                });
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array means it runs once on component mount

    return (
        <>
        <ManagerHeader />
        <Container fluid >            
            <Row>
                {/* Sidebar */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                    <ManagerSidebar />
                </Col>

                {/* Main Dashboard Content */}
                <Col md={9} lg={10} className="px-md-4">
                    <h2 className="mt-3">Manager Dashboard</h2>
                    <hr/>
                    <h2>User Insight:</h2>
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
                                <h5>Suspended Now</h5>
                                <p>{dashboardData.activeNow}</p>
                            </Card>
                        </Col>
                    </Row>
                    <hr/>
                    <h2>Product Insight:</h2>
                    <Row className="g-3">
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Total Product</h5>
                                <p>{dashboardData.totalUsers}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Popular Categories</h5>
                                <p>{dashboardData.activeNow}</p>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
        </>
    );
}
