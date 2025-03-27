import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/Sidebar';
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';

export default function OrderDetails() {
    const { id, username } = useParams(); // Get both the order ID and username from the URL
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch order details from the backend API
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await fetch(`/api/order-details/${id}`);
                const data = await response.json();
                setOrderDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id]);

    const BackToOrderHistory = () => {
        navigate(`/order-history/${username}`);  // Navigate back with the username
    };

    return (
        <>
            <AuthorityHeader />
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>
                    <Col>
                        <h2>Order Details</h2>
                        <hr />
                        {loading ? (
                            <p>Loading...</p>
                        ) : orderDetails ? (
                            <div>
                                {console.log(orderDetails)}
                                <h2> Invoice #{orderDetails._id}</h2>
                                <br />
                                <p>Status: {orderDetails.status}</p>
                                <p>Seller: {orderDetails.seller}</p>
                                <p>Purchase Date: {orderDetails.purchased}</p>
                            </div>
                        ) : (
                            <p>Order not found.</p>
                        )}
                        <hr/>
                        <Button onClick={BackToOrderHistory}>Back</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
