// src/Pages/Payment.js (Refined for Cart Checkout Simulation)

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, ListGroup, Spinner } from 'react-bootstrap'; // Added Spinner
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Payment.css'; // Ensure this path is correct
import UserHeader from '../Components/Headers/userHeader'; // Ensure path is correct
import { getAuthToken } from '../utils/auth'; // Ensure path is correct
import { useCart } from '../Components/CartContext'; // Ensure path is correct

// Helper to check login status (replace with context if available)
const isLoggedIn = () => !!getAuthToken();

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    // Get cart data passed via navigation state from Cart page
    const { cartItems = [], totalAmount = 0 } = location.state || {};

    // State for fake card inputs
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    // State for feedback and loading
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
    const [isLoading, setIsLoading] = useState(false);

    // Effect to check if necessary data was passed from the cart
    useEffect(() => {
        // Check runs only once on mount if data seems invalid initially
        if (!location.state || !Array.isArray(cartItems) || cartItems.length === 0 || totalAmount <= 0) {
            setMessage('Error: Invalid cart data for payment. Redirecting to cart...');
            setMessageType('danger');
            const timer = setTimeout(() => navigate('/cart'), 3000); // Redirect back after 3s
            return () => clearTimeout(timer); // Cleanup timer on unmount
        }
    }, []); // Empty dependency array means this runs once on mount

    // Basic check if card simulation fields look filled
    const checkFormFilled = () => {
        if (!cardNumber || !expirationDate || !cvv || !nameOnCard) {
            setMessage('Please fill in all fake card details to simulate payment.');
            setMessageType('danger');
            return false;
        }
        // Add simple format checks if desired for better simulation
        setMessage('');
        setMessageType('');
        return true;
    };

    // Handle form submission -> Call backend checkout endpoint
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkFormFilled()) return; // Stop if fake fields aren't filled

        setIsLoading(true);
        setMessage('');
        setMessageType('');
        const token = getAuthToken(); // Get auth token

        if (!token) {
            setMessage('Authentication error. Please log in.');
            setMessageType('danger');
            setIsLoading(false);
            return;
        }

        // Ensure cartItems are still valid before sending
        if (!cartItems || cartItems.length === 0) {
             setMessage('Cannot checkout with an empty cart.');
             setMessageType('danger');
             setIsLoading(false);
             return;
        }

        try {
            // Call the backend endpoint for cart checkout
            const response = await fetch('/api/virtual/checkout', { // Endpoint for cart processing
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Send the cart items array (ensure it contains productId, sellerId, price, quantity)
                body: JSON.stringify({ cartItems: cartItems })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Checkout failed (Status: ${response.status})`);
            }

            // Handle successful checkout
            setMessage("Checkout Successful!");
            setMessageType('success');
            clearCart(); // Clear the cart state via context/hook

            // Reset card fields
            setCardNumber('');
            setExpirationDate('');
            setCvv('');
            setNameOnCard('');
            
             // Wait for a few seconds (e.g., 3000ms = 3s) before navigating
             const redirectTimer = setTimeout(() => {
                console.log("REDIRECT TIMER FIRED - Attempting navigation..."); // Add this line
                navigate('/home'); // Navigate to home page
            }, 3000);

        } catch (error) {
            console.error('Checkout Error:', error);
            setMessage(`Error: ${error.message}`);
            setMessageType('danger');
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    };

    // Determine if the form can be submitted
    const canSubmit = cartItems.length > 0 && totalAmount > 0 && !isLoading;

    return (
        <>
            <UserHeader loginStatus={isLoggedIn()} />
            <Container className="mt-4 payment-page-container">
                <h1>Confirm Payment</h1>
                <Row>
                    {/* Order Summary Column */}
                    <Col md={7}>
                        <h2>Order Summary</h2>
                        {cartItems.length > 0 ? (
                            <ListGroup variant="flush" className="mb-3 order-summary-box"> {/* Added class */}
                                {/* You could optionally map cartItems here for a detailed summary */}
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span>Items ({cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)})</span>
                                    {/* Maybe show subtotal/discount again if needed */}
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <strong>Total Amount to Pay</strong>
                                    <strong>${totalAmount.toFixed(2)}</strong>
                                </ListGroup.Item>
                            </ListGroup>
                        ) : (
                            // Show message if cart somehow became empty after navigation
                            !message && <Alert variant="warning">Cart is empty or invalid.</Alert>
                        )}
                    </Col>

                    {/* Payment Simulation Column */}
                    <Col md={5}>
                        <h2>Payment by Credit Card</h2>
                        {!canSubmit && cartItems.length > 0 && !isLoading && <Alert variant="warning">Enter card details to proceed.</Alert> }

                        <Form onSubmit={handleSubmit} className="payment-form-area">
                            {/* --- Fake Card Details Section --- */}
                            <fieldset className="fake-card-details mb-3" disabled={isLoading || !canSubmit}>
                                <legend>Card Details</legend>
                                {/* Card Number */}
                                <Form.Group controlId="cardNumber" className="mb-2">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        disabled={isLoading || !canSubmit}
                                        required // Add basic required for simulation check
                                    />
                                </Form.Group>
                                {/* Expiry and CVV */}
                                <Row>
                                    <Col>
                                        <Form.Group controlId="expirationDate" className="mb-2">
                                            <Form.Label>Expiration (MM/YY)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="MM/YY"
                                                value={expirationDate}
                                                onChange={(e) => setExpirationDate(e.target.value)}
                                                disabled={isLoading || !canSubmit}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="cvv" className="mb-2">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="123"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value)}
                                                disabled={isLoading || !canSubmit}
                                                maxLength={3}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* Name on Card */}
                                <Form.Group controlId="nameOnCard" className="mb-3">
                                    <Form.Label>Name on Card</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                        disabled={isLoading || !canSubmit}
                                        required
                                    />
                                </Form.Group>
                               
                            </fieldset>

                             {/* Display Feedback Messages */}
                            {message && (
                                <Alert variant={messageType || 'info'} className="mt-3">
                                    {message}
                                </Alert>
                            )}

                            {/* Submit Button */}
                            <Button variant="primary" type="submit" disabled={isLoading || !canSubmit} className="mt-3 w-100">
                                {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : `Confirm & Pay $${totalAmount.toFixed(2)}`}
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Payment;