// src/Pages/Payment.js  
import React, { useState } from 'react';  
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';  
import '../css/Payment.css'; // Import your CSS file  

const Payment = () => {  
    const [paymentMethod, setPaymentMethod] = useState('credit');  
    const [cardNumber, setCardNumber] = useState('');  
    const [expirationDate, setExpirationDate] = useState('');  
    const [cvv, setCvv] = useState('');  
    const [nameOnCard, setNameOnCard] = useState('');  
    const [error, setError] = useState('');  
    const [success, setSuccess] = useState(false);  

    const validateForm = () => {  
        if (paymentMethod === 'credit') {  
            if (!cardNumber || !expirationDate || !cvv || !nameOnCard) {  
                setError('All fields are required.');  
                return false;  
            }  

            const sanitizedCardNumber = cardNumber.replace(/\s/g, '');  
            if (!/^\d{16}$/.test(sanitizedCardNumber)) {  
                setError('Card number must be exactly 16 digits.');  
                return false;  
            }  

            if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {  
                setError('Expiration date must be in MM/YY format.');  
                return false;  
            }  

            if (!/^\d{3}$/.test(cvv)) {  
                setError('CVV must be exactly 3 digits.');  
                return false;  
            }  

            if (!/^[a-zA-Z\s]+$/.test(nameOnCard)) {  
                setError('Name on card must only contain alphabetic characters.');  
                return false;  
            }  
        }  

        setError('');  
        return true;  
    };  

    const handleConfirm = (e) => {  
        e.preventDefault();  
        if (validateForm()) {  
            setSuccess(true);  
        }  
    };  

    const handlePaymentMethodChange = (method) => {  
        setPaymentMethod(method);  
        setSuccess(false);  
        if (method === 'paynow') {  
            // Reset card details when switching to Paynow  
            setCardNumber('');  
            setExpirationDate('');  
            setCvv('');  
            setNameOnCard('');  
            setError('');  
        }  
    };  

    return (  
        <Container className="mt-4">  
            <h1>Payment</h1>  
            <Row className="payment-container">  
                <Col className="payment-method">  
                    <Form.Group>  
                        <Form.Check   
                            type="radio"   
                            label="Credit/Debit Card"   
                            name="paymentMethod"   
                            id="creditCard"   
                            checked={paymentMethod === 'credit'}   
                            onChange={() => handlePaymentMethodChange('credit')}   
                        />  
                        <Form.Check   
                            type="radio"   
                            label="Paynow"   
                            name="paymentMethod"   
                            id="paynow"   
                            checked={paymentMethod === 'paynow'}   
                            onChange={() => handlePaymentMethodChange('paynow')}   
                        />  
                    </Form.Group>  
                </Col>  
                <Col className="payment-form">  
                    <Form onSubmit={handleConfirm}>  
                        {paymentMethod === 'credit' && (  
                            <div className="card-details">  
                                <Form.Group controlId="cardNumber">  
                                    <Form.Label>Card Number</Form.Label>  
                                    <Form.Control   
                                        type="text"   
                                        placeholder="Enter card number"   
                                        value={cardNumber}  
                                        onChange={(e) => setCardNumber(e.target.value)}   
                                    />  
                                </Form.Group>  
                                <Row>  
                                    <Col>  
                                        <Form.Group controlId="expirationDate">  
                                            <Form.Label>Expiration date (MM/YY)</Form.Label>  
                                            <Form.Control   
                                                type="text"   
                                                placeholder="MM/YY"   
                                                value={expirationDate}  
                                                onChange={(e) => setExpirationDate(e.target.value)}   
                                            />  
                                        </Form.Group>  
                                    </Col>  
                                    <Col>  
                                        <Form.Group controlId="cvv">  
                                            <Form.Label>CVV</Form.Label>  
                                            <Form.Control   
                                                type="text"   
                                                placeholder="CVV"   
                                                value={cvv}  
                                                onChange={(e) => setCvv(e.target.value)}   
                                            />  
                                        </Form.Group>  
                                    </Col>  
                                </Row>  
                                <Form.Group controlId="nameOnCard">  
                                    <Form.Label>Name on Card</Form.Label>  
                                    <Form.Control   
                                        type="text"   
                                        placeholder="Enter name"   
                                        value={nameOnCard}  
                                        onChange={(e) => setNameOnCard(e.target.value)}   
                                    />  
                                </Form.Group>  
                                <Form.Group>  
                                    <Form.Check   
                                        type="checkbox"   
                                        label="Terms and conditions..."   
                                    />  
                                </Form.Group>  
                                <Button variant="primary" type="submit">Confirm</Button>  
                            </div>  
                        )}  
                        {paymentMethod === 'paynow' && (  
                            <div className="paynow-qr">  
                                <div className="qr-placeholder">  
                                    <img   
                                        src="https://via.placeholder.com/150"   
                                        alt=""   
                                        className="qr-image"   
                                    />  
                                    <span>Paynow QR</span>  
                                </div>  
                                <Form.Group>  
                                    
                                </Form.Group>  
                                <Button variant="primary" type="submit">Confirm</Button>  
                            </div>  
                        )}  
                    </Form>  
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}  
                    {success && <Alert variant="success" className="mt-3">Payment Successful!</Alert>}  
                </Col>  
            </Row>  
        </Container>  
    );  
};  

export default Payment;  