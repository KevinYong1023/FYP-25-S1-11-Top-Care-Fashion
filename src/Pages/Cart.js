// src/Pages/Cart.js
import React, { useState } from 'react';
import { useCart } from '../Components/CartContext';
import { Container, Row, Col, Card as BootstrapCard, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css';
import UserHeader from '../Components/Headers/userHeader';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');

  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const total = subtotal - discountAmount;

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    if (discountAmount > 0) {
      applyDiscount(appliedDiscountCode);
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
      setAppliedDiscountCode(code);
    } else if (code === 'FLAT20') {
      discount = 20;
      setAppliedDiscountCode(code);
    } else if (code === 'FREE') {
      discount = subtotal;
      setAppliedDiscountCode(code);
    } else {
      alert(`Invalid discount code: "${code}"`);
      setDiscountCode('');
      return;
    }

    setDiscountAmount(discount);
    if (discount > 0) {
      alert(`Discount code "${code}" applied!`);
    }
    setDiscountCode('');
  };

  return (
    <>
      <UserHeader loginStatus={true} />
      <Container className="mt-4">
        <h2 style={{fontWeight: 'bold', color: '#6f4e37'}}>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <BootstrapCard className="mb-4" key={item.id}>
                <BootstrapCard.Body>
                  <Row>
                    <Col md={3}>
                      <img
                        src={item.imageUrl || "https://via.placeholder.com/100"}
                        alt={item.title || "Item"}
                        className="img-fluid"
                        style={{ maxHeight: "100px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col md={5}>
                      <h5>{item.title}</h5>
                    </Col>
                    <Col md={2}>
                      <p>${item.price.toFixed(2)}</p>
                    </Col>
                    <Col md={2}>
                      <Button 
                        className="btn"
                        style={{
                        backgroundColor: "#f08080",
                        borderColor: "#f08080",
                        color: "white",
                        fontWeight: 'bold',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f4978e";
                        e.target.style.borderColor = "#f4978e";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#f08080";
                        e.target.style.borderColor = "#f08080";
                      }}
                      onClick={() => handleRemove(item.id)}>Remove</Button>
                    </Col>
                  </Row>
                </BootstrapCard.Body>
              </BootstrapCard>
            ))}

            <Row className="mb-4">
              <Col className="d-flex justify-content-end">
                <Form.Group controlId="discountCode">
                  <Form.Label style={{fontWeight: 'bold'}}>Discount / Promo Code</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Enter code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="me-2 discount-input"
                    />
                    <Button 
                    className="btn"
                    style={{
                      backgroundColor: "#ad9984",
                      borderColor: "#ad9984",
                      color: "white",
                      fontWeight: 'bold',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#ddbea9";
                      e.target.style.borderColor = "#ddbea9";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#ad9984";
                      e.target.style.borderColor = "#ad9984";
                    }}
                    onClick={handleApplyDiscount}>Apply</Button>
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
                <h5 style={{fontWeight: 'bold', fontSize: '24px'}}>Total: ${total.toFixed(2)}</h5>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col className="d-flex flex-column align-items-end">
                <Button 
                className="btn mb-2"
                style={{
                  backgroundColor: "#f08080",
                  borderColor: "#f08080",
                  color: "white",
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#f4978e";
                  e.target.style.borderColor = "#f4978e";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f08080";
                  e.target.style.borderColor = "#f08080";
                }}
                onClick={clearCart}>Clear Cart</Button>
                <Button 
                style={{
                  backgroundColor: "#97a97c",
                  borderColor: "#97a97c",
                  color: "white",
                  transition: "background-color 0.3s ease",
                  fontSize: '20px',
                  fontWeight: 'bold',
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#85986c";
                  e.target.style.borderColor = "#85986c";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#97a97c";
                  e.target.style.borderColor = "#97a97c";
                }}
                onClick={handleCheckout} className="checkout-button">Check Out</Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;