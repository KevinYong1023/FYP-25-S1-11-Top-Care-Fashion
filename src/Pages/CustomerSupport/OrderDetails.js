import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import orderData from '../../mockdata/orderhistory.json'; // Import the JSON data

export default function OrderDetails() {
    const { inv } = useParams(); // Get the invoice ID from the URL
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        console.log(inv); // Check if the invoice ID is correctly passed
        if (inv) {
            // Find the order using the invoice ID
            const order = orderData.find((item) => item.inv === parseInt(inv));
            setOrderDetails(order);
        }
    }, [inv]);

    // Conditionally render only when orderDetails is not null
    return (
        <>
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar - fixed width, no padding */}
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>
                    <Col>
                        <h2>Order Details</h2>
                        <hr />
                        {orderDetails ? (
                            <div>
                                <h2> Invoice #{orderDetails.inv}</h2>
                                <br />
                                <p>Status: {orderDetails.status}</p>
                                <p>Seller: {orderDetails.seller}</p>
                                <p>Purchase Date: {orderDetails.purchase_date}</p>
                            </div>
                        ) : (
                            <p>Loading or Order not found...</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
