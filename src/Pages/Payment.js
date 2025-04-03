// src/Pages/Payment.js

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../css/Payment.css'; // Make sure this CSS file exists and the path is correct
import UserHeader from '../Components/Headers/userHeader'; // Assuming this component exists

// Import the function to get the authentication token
import { getAuthToken } from '../utils/auth'; // Adjust path if your utils folder is elsewhere

const Payment = () => {
    // State variables for form inputs needed for the transfer
    const [recipientEmail, setRecipientEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // State for the fake card inputs (primarily for UI simulation)
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    // State for feedback messages and loading indicator
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
    const [isLoading, setIsLoading] = useState(false);

    // --- Basic Check if Simulation Fields Are Filled ---
    // Ensures the user interacts with the fake card form for the simulation effect.
    const checkFormFilled = () => {
        if (!recipientEmail || !amount || parseFloat(amount) <= 0) {
            setMessage('Recipient Email and a positive Amount are required.');
            setMessageType('danger');
            return false;
        }
        // Check if fake card fields seem filled (for UI simulation purpose only)
        if (!cardNumber || !expirationDate || !cvv || !nameOnCard) {
            setMessage('Please fill in the fake card details to simulate payment.');
            setMessageType('danger');
            return false;
        }
        // Optional: Add basic format checks here if desired for UI realism, e.g.,
        // if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) { ... }

        setMessage(''); // Clear error if basic checks pass
        setMessageType('');
        return true;
    };

    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default HTML form submission
        setMessage('');     // Clear previous messages
        setMessageType('');

        // Perform basic check if simulation fields are filled
        if (!checkFormFilled()) {
            return;
        }

        setIsLoading(true); // Set loading state
        const token = getAuthToken(); // Retrieve the stored auth token

        // Check if user is authenticated (token exists)
        if (!token) {
             setMessage('Authentication error. Please log in again.');
             setMessageType('danger');
             setIsLoading(false);
             return; // Stop submission if not authenticated
        }

        // --- Call Backend API ---
        // Send ONLY recipient, amount, description, and token
        // DO NOT send fake card details
        try {
            const response = await fetch('/api/virtual/transfer', { // The backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Pass the JWT token
                },
                body: JSON.stringify({
                    recipientEmail: recipientEmail,
                    amount: amount,
                    description: description
                })
            });

            const data = await response.json(); // Attempt to parse the JSON response body

            if (!response.ok) {
                // If response status is not 2xx, throw an error with backend message
                throw new Error(data.message || `Server error: ${response.status}`);
            }

            // --- Handle Success ---
            setMessage(`Success! ${data.message || 'Transfer complete.'} ${data.newBalance !== null ? `Your new balance: ${data.newBalance.toFixed(2)}` : ''}`);
            setMessageType('success');
            // Reset form fields after successful submission
            setRecipientEmail('');
            setAmount('');
            setDescription('');
            setCardNumber('');
            setExpirationDate('');
            setCvv('');
            setNameOnCard('');

        } catch (error) {
            // --- Handle Errors (Network or Backend) ---
            console.error('Transfer Error:', error);
            setMessage(`Error: ${error.message}`);
            setMessageType('danger');
        } finally {
            // --- Reset Loading State ---
            setIsLoading(false); // Re-enable button, etc.
        }
    };

    // --- Render the Component JSX ---
    return (
        <>
            {/* Assumes UserHeader uses auth status, potentially from context or token check */}
            <UserHeader loginStatus={!!getAuthToken()} />
            <Container className="mt-4 payment-page-container">
                <h1>Send Fake Money</h1>
                <p>Simulate sending virtual currency using card details.</p>

                <Form onSubmit={handleSubmit} className="payment-form-area">
                    {/* --- Fields for the Actual Transfer --- */}
                    <Form.Group controlId="recipientEmail" className="mb-3">
                        <Form.Label>Recipient Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="recipient@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>

                    <Form.Group controlId="amount" className="mb-3">
                        <Form.Label>Amount ($)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="10.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0.01"
                            required
                            disabled={isLoading}
                        />
                    </Form.Group>

                     <Form.Group controlId="description" className="mb-3">
                        <Form.Label>Description (Optional)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="For virtual item"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                        />
                    </Form.Group>

                    {/* --- Fake Card Details Section (UI Simulation Only) --- */}
                    <fieldset className="fake-card-details mb-3">
                        <legend>Card Details (Simulation Only)</legend>
                        {/* Card Number */}
                        <Form.Group controlId="cardNumber" className="mb-2">
                           <Form.Label>Card Number</Form.Label>
                           <Form.Control
                               type="text"
                               placeholder="Enter 16 digits"
                               value={cardNumber}
                               onChange={(e) => setCardNumber(e.target.value)}
                               disabled={isLoading}
                               // Add maxLength={16} or formatting if desired
                           />
                       </Form.Group>
                       {/* Expiry and CVV */}
                       <Row>
                           <Col>
                               <Form.Group controlId="expirationDate" className="mb-2">
                                   <Form.Label>Expiration (MM/YY)</Form.Label>
                                   <Form.Control type="text" placeholder="MM/YY" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} disabled={isLoading} />
                               </Form.Group>
                           </Col>
                           <Col>
                               <Form.Group controlId="cvv" className="mb-2">
                                   <Form.Label>CVV</Form.Label>
                                   <Form.Control type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} disabled={isLoading} maxLength={3}/>
                               </Form.Group>
                           </Col>
                       </Row>
                       {/* Name on Card */}
                       <Form.Group controlId="nameOnCard" className="mb-3">
                           <Form.Label>Name on Card</Form.Label>
                           <Form.Control type="text" placeholder="Enter name" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} disabled={isLoading} />
                       </Form.Group>
                       <small>These card details are for simulation only and are not processed.</small>
                   </fieldset>

                    {/* Display Feedback Messages */}
                   {message && (
                       <Alert variant={messageType || 'info'} className="mt-3">
                           {message}
                       </Alert>
                   )}

                   {/* Submit Button */}
                   <Button variant="primary" type="submit" disabled={isLoading} className="mt-3">
                       {isLoading ? 'Processing...' : 'Confirm Payment'}
                   </Button>
               </Form>
           </Container>
       </>
   );
};

export default Payment;