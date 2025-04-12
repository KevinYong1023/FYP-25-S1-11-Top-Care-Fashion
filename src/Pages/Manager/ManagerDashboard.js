import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card,Spinner} from "react-bootstrap";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar"; 
import ManagerHeader from "../../Components/Headers/ManagerHeader"; 

export default function ManagerDashboard() {
    const [isLoading, setIsLoading] = useState(false)
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        active: 0,
        suspense: 0,
        popularCategories: "", // Keep static or fetch if needed
        totalProducts: 0,
        categoryCounts: {
            Footwear: 0,
            Top: 0,
            Bottom: 0
        }
    });

    // Fetch users from backend and update dashboard data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/user");
                const users = await response.json();
                const filteredUsers = users.filter(user => user.position === "user");
            
                const totalUsers = filteredUsers.length;
                // Count active users (assuming 'status' field contains "Active")
                const activeNow = filteredUsers.filter(user => user.status === "Active" && user.position === "user").length;
                const suspensedNow = filteredUsers.filter(user => user.status === "Suspended" && user.position === "user").length;
                setDashboardData(prevData => ({
                    ...prevData,
                    totalUsers,
                    active: activeNow,   // Use 'active' here
                    suspense: suspensedNow  // Use 'suspense' here
                }));
            } catch (error) {
                console.error("Error fetching users:", error);
            }finally{
                setIsLoading(false)
            }
        };

        const fetchProductInsights = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/products");
                const data = await response.json();
        
                // Initialize counts
                let totalProducts = 0;
                let categoryCounts = {
                    Footwear: 0,
                    Top: 0,
                    Bottom: 0
                };
        
                // Count total products and products per category
                data.forEach(product => {
                    totalProducts += 1;
        
                    if (product.category === "Footwear") {
                        categoryCounts.Footwear += 1;
                    } else if (product.category === "Top") {
                        categoryCounts.Top += 1;
                    } else if (product.category === "Bottom") {
                        categoryCounts.Bottom += 1;
                    }
                });
        
                // Update dashboard data
                setDashboardData(prevData => ({
                    ...prevData,
                    totalProducts: totalProducts,
                    categoryCounts: categoryCounts
                }));
            } catch (error) {
                console.error("Error fetching product insights:", error);
            }finally{
                setIsLoading(false)
            }
        };
        fetchUsers();
        fetchProductInsights();
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
                {
                        isLoading ? (
                            <div className="text-center" style={{ marginTop: '100px' }}>
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Loading</span>
                                </Spinner>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ):(<>
                    <h2 className="mt-3">Website Insights</h2>
                    <hr/>
                    <h2>Users:</h2>
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
                                <p>{dashboardData.active}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Suspended Now</h5>
                                <p>{dashboardData.suspense}</p>
                            </Card>
                        </Col>
                    </Row>
                    <hr/>
                    <h2>Products:</h2>
                    <Row className="g-3">
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Total Products</h5>
                                <p>{dashboardData.totalProducts}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3">
                                <h5>Popular Categories</h5>
                                <ul>
                                    <li>Footwear: {dashboardData.categoryCounts.Footwear}</li>
                                    <li>Top: {dashboardData.categoryCounts.Top}</li>
                                    <li>Bottom: {dashboardData.categoryCounts.Bottom}</li>
                                </ul>
                            </Card>
                        </Col>
                    </Row></>)}
                </Col>
            </Row>
        </Container>
        </>
    );
}
