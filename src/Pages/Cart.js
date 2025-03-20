// src/Pages/Cart.js
import React, { useState } from 'react';
import { useCart } from '../Components/CartContext';
import { Container, Row, Col, Card as BootstrapCard, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css'; // Import the CSS file
import UserHeader from '../Components/Headers/userHeader';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [discountCode, setDiscountCode] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedDiscountCode, setAppliedDiscountCode] = useState(''); // New state for applied discount code

    const subtotal = cart.reduce((total, item) => total + item.price, 0);
    const total = subtotal - discountAmount;

    const handleRemove = (itemId) => {
        removeFromCart(itemId);
        if (discountAmount > 0) {
            applyDiscount(appliedDiscountCode); // Reapply discount with the applied code
        }
    };

    const handleCheckout = () => {
        navigate('/payment');
    };

    const handleApplyDiscount = () => {
        applyDiscount(discountCode);
    };

    const applyDiscount = (code) => {
        let discount = 0;
        if (code === 'SAVE10') {
            discount = subtotal * 0.1;
            setAppliedDiscountCode(code); // Store the applied code
        } else if (code === 'FLAT20') {
            discount = 20;
            setAppliedDiscountCode(code);
        } else if (code === 'FREE') {
            discount = subtotal;
            setAppliedDiscountCode(code);
        } else {
            alert(`Invalid discount code: "${code}"`);
            setDiscountCode('');
            return; // Don't reset discountAmount, keep the previous discount
        }

        setDiscountAmount(discount);
        if(discount > 0){
            alert(`Discount code "${code}" applied!`);
        }
        setDiscountCode('');
    };

    return (
        <>
                    <UserHeader loginStatus={true} />
        <Container className="mt-4">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <BootstrapCard className="mb-4" key={item.id}>
                            <BootstrapCard.Body>
                                <Row>
                                    <Col>
                                        <img src="/api/placeholder/100/100" alt={item.name} className="img-fluid" />
                                    </Col>
                                    <Col>
                                        <BootstrapCard.Title>{item.name}</BootstrapCard.Title>
                                    </Col>
                                    <Col>
                                        <BootstrapCard.Text>${item.price.toFixed(2)}</BootstrapCard.Text>
                                    </Col>
                                    <Col>
                                        <Button variant="danger" onClick={() => handleRemove(item.id)}>Remove</Button>
                                    </Col>
                                </Row>
                            </BootstrapCard.Body>
                        </BootstrapCard>
                    ))}

                    <Row className="mb-4">
                        <Col className="d-flex justify-content-end">
                            <Form.Group controlId="discountCode">
                                <Form.Label>Discount / Promo Code</Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter code"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        className="me-2 discount-input"
                                    />
                                    <Button variant="primary" onClick={handleApplyDiscount}>Apply</Button>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col className="d-flex justify-content-end">
                            <h5>Summary</h5>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col className="d-flex justify-content-end">
                            <p>Subtotal: ${subtotal.toFixed(2)}</p>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col className="d-flex justify-content-end">
                            <p>Discount: ${discountAmount.toFixed(2)} {appliedDiscountCode && `(${appliedDiscountCode})`}</p>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col className="d-flex justify-content-end">
                            <h5>Total: ${total.toFixed(2)}</h5>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col className="d-flex flex-column align-items-end">
                            <Button variant="danger" onClick={clearCart} className="clear-cart-button mb-2">Clear Cart</Button>
                            <Button variant="success" onClick={handleCheckout} className="checkout-button">Check Out</Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
        </>
    );
};

export default Cart;