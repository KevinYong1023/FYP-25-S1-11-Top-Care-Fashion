import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/Payment.css';
import UserHeader from '../Components/Headers/userHeader';
import { getAuthToken } from '../utils/auth';
import { useCart } from '../Components/CartContext';

const isLoggedIn = () => !!getAuthToken();

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const { cartItems = [], totalAmount = 0 } = location.state || {};

    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false); 
    const [loggedInUserName, setLoggedInUserName] = useState('');

    useEffect(() => {
        if (!location.state || !Array.isArray(cartItems) || cartItems.length === 0 || totalAmount <= 0) {
            setMessage('Error: Invalid cart data for payment. Redirecting to cart...');
            setMessageType('danger');
            const timer = setTimeout(() => navigate('/cart'), 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state, cartItems, navigate]);

     const isCardNumberValid = () => {
        const trimmed = cardNumber.replace(/\s+/g, '');
        return /^\d{16}$/.test(trimmed);
    };

    const isExpiryValid = () => {
        const [month, year] = expirationDate.split('/');
        if (!month || !year || !/^\d{2}\/\d{2}$/.test(expirationDate)) return false;

        const now = new Date();
        const expMonth = parseInt(month, 10);
        const expYear = parseInt('20' + year, 10);

        if (expMonth < 1 || expMonth > 12) return false;

        const expiryDate = new Date(expYear, expMonth);
        return expiryDate > now;
    };

    const isCvvValid = () => /^\d{3}$/.test(cvv);

    const isNameValid = () => /^[A-Za-z ]{2,}$/.test(nameOnCard.trim());

    const checkFormFilled = () => {
        if (!cardNumber || !expirationDate || !cvv || !nameOnCard) {
            setMessage('Please fill in all fake card details to simulate payment.');
            setMessageType('danger');
            return false;
        }

        if (!isCardNumberValid()) {
            setMessage('Invalid card number. It must be 16 digits.');
            setMessageType('danger');
            return false;
        }

        if (!isExpiryValid()) {
            setMessage('Invalid expiry date. Format must be MM/YY and in the future.');
            setMessageType('danger');
            return false;
        }

        if (!isCvvValid()) {
            setMessage('Invalid CVV. It must be 3 digits.');
            setMessageType('danger');
            return false;
        }

        if (!isNameValid()) {
            setMessage('Name must only contain letters and spaces.');
            setMessageType('danger');
            return false;
        }

        setMessage('');
        setMessageType('');
        return true;
    };

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = getAuthToken();
                if (!token) {
                    setMessage('Authentication error. Please log in.');
                    setMessageType('danger');
                    return;
                }
                const response = await fetch('/api/user', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch user data');
                }

                const userData = await response.json();
                setLoggedInUserName(userData.name);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setMessage(`Error fetching user data: ${error.message}`);
                setMessageType('danger');
            }
        };

        fetchUserName();
        const token = getAuthToken();
        console.log("Token from localStorage:", token);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!checkFormFilled()) return;

        setIsLoading(true);
        setMessage('');
        setMessageType('');
        const token = getAuthToken();

        if (!token) {
            setMessage('Authentication error. Please log in.');
            setMessageType('danger');
            setIsLoading(false);
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            setMessage('Cannot checkout with an empty cart.');
            setMessageType('danger');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/virtual/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems: cartItems })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `Checkout failed (Status: ${response.status})`);
            }

            setMessage("Checkout Successful!");
            setMessageType('success');
            clearCart();

            setCardNumber('');
            setExpirationDate('');
            setCvv('');
            setNameOnCard('');
            console.log("cartItems within handleSubmit: ", cartItems)
            console.log("User Name within handleSubmit: ", loggedInUserName);

            await createOrder(cartItems, totalAmount, token, loggedInUserName);

            setIsRedirecting(true);
            setTimeout(() => {
                navigate('/home');
            }, 3000);

        } catch (error) {
            console.error('Checkout Error:', error);
            setMessage(`Error: ${error.message}`);
            setMessageType('danger');
        } finally {
            setIsLoading(false);
        }
    };

    

    const createOrder = async (cartItems, totalAmount, token, userName) => {
        let allSellerNames = "";
        const uniqueSellerNames = new Set();
        console.log("Cart Items being sent:", cartItems);

        let calculatedTotal = 0;
        cartItems.forEach((item) => {
            console.log("Item:", item);
            console.log("Item Price (before parse):", item.price, typeof item.price);
            const price = parseFloat(item.price);
            console.log("Item Price (after parse):", price, typeof price);
            if (isNaN(price)) {
                console.error("ERROR: Price is NaN for item:", item);
                return;
            }
            calculatedTotal += price;
            if (item.sellerName) {
                uniqueSellerNames.add(item.sellerName);
            }
        });
        console.log("Calculated Total:", calculatedTotal);
        const totalAmountToSend = calculatedTotal;

        allSellerNames = Array.from(uniqueSellerNames).join(", ");
        if (!allSellerNames) {
            allSellerNames = "No Sellers";
        }
        console.log("Total Amount To Send: ", totalAmountToSend);
        console.log("createOrder - userName:", userName);  // Add this line

    
        try {
            const orderResponse = await fetch("/api/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    seller: cartItems.map((item) => {
                        console.log("Item within map:", item);
                        if (!item.sellerName) {
                            console.error("ERROR: sellerName is missing for:", item);
                        }
                        if (!item.productName) {
                            console.error("ERROR: productName is missing for:", item);
                        }
                        return {
                            productId: item.productId,
                            sellerName: item.sellerName,
                            productName: item.productName,
                            buyerName: userName,
                            price:item.price
                        };
                    }),
                    total: totalAmountToSend,
                    
                }),
            });
            if (!orderResponse.ok) {
                const orderData = await orderResponse.json();
                throw new Error(orderData.message || "Failed to create order");
            }
    
            // 🔁 Update each product's isOrdered to true
            for (const item of cartItems) {
                try {
                    console.log("⏫ Updating product with name:", item.productName);
                    const res = await fetch(`/api/products/update-product-status`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ productName: item.productName, isOrdered: true }),
                    });
    
                    const data = await res.json();
                    if (res.ok) {
                        console.log(`Product "${item.productName}" order status updated`);
                    } else {
                        console.error(`Failed to update "${item.productName}":`, data.message);
                        setMessage(`Product order status update failed: ${data.message}`);
                        setMessageType("danger");
                    }
                } catch (err) {
                    console.error(`Error updating "${item.productName}":`, err);
                }
            }
    
            const orderData = await orderResponse.json();
            console.log("Order created successfully", orderData.orderDetails);
            setMessage("Order created successfully!");
            setMessageType("success");
            return orderData;
        } catch (orderError) {
            console.error("Order creation error:", orderError);
            setMessage(`Order creation failed: ${orderError.message}`);
            setMessageType("danger");
            throw orderError;
        }
    };
    

    const canSubmit = cartItems.length > 0 && totalAmount > 0 && !isLoading && !isRedirecting;

    return (
        <>
            <UserHeader loginStatus={isLoggedIn()} />
            <Container className="mt-4 payment-page-container">
                <h1>Confirm Payment</h1>
                <Row>
                    <Col md={7}>
                        <h2>Order Summary</h2>
                        {cartItems.length > 0 ? (
                            <ListGroup variant="flush" className="mb-3 order-summary-box">
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span>Items ({cartItems.length})</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <strong>Total Amount to Pay</strong>
                                    <strong>${totalAmount.toFixed(2)}</strong>
                                </ListGroup.Item>
                            </ListGroup>
                        ) : (
                            !message && <Alert variant="warning">Cart is empty or invalid.</Alert>
                        )}
                    </Col>

                    <Col md={5}>
                        <h2>Payment by Credit Card</h2>
                        {!canSubmit && cartItems.length > 0 && !isLoading && !isRedirecting && 
                        (<Alert variant="warning">Enter card details to proceed.</Alert>  )}

                        <Form onSubmit={handleSubmit} className="payment-form-area">
                            <fieldset className="fake-card-details mb-3" disabled={isLoading || !canSubmit}>
                                <legend>Card Details</legend>
                                <Form.Group controlId="cardNumber" className="mb-2">
                                    <Form.Label>Card Number</Form.Label>
                                    <Form.Control type="text" placeholder="xxxx xxxx xxxx xxxx" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} disabled={isLoading || !canSubmit} required />
                                </Form.Group>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="expirationDate" className="mb-2">
                                            <Form.Label>Expiration (MM/YY)</Form.Label>
                                            <Form.Control type="text" placeholder="MM/YY" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} disabled={isLoading || !canSubmit} required />
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId="cvv" className="mb-2">
                                            <Form.Label>CVV</Form.Label>
                                            <Form.Control type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} disabled={isLoading || !canSubmit} maxLength={3} required />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group controlId="nameOnCard" className="mb-3">
                                    <Form.Label>Name on Card</Form.Label>
                                    <Form.Control type="text" placeholder="Enter name" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} disabled={isLoading || !canSubmit} required />
                                </Form.Group>
                            </fieldset>

                            {message && (
                                <Alert variant={messageType || 'info'} className="mt-3">
                                    {message}
                                </Alert>
                            )}
                            {
                                 <Button
                                 variant="primary"
                                 type="submit"
                                 disabled={isLoading || isRedirecting} // ✅ this disables the button properly
                                 className="mt-3 w-100"
                             >
                                 {isRedirecting
                                     ? "Redirecting to home..."
                                     : isLoading
                                         ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                         : `Confirm & Pay $${totalAmount.toFixed(2)}`}
                             </Button>
                            }
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default Payment;