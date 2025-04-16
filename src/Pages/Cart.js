// src/Pages/Cart.js (No Discount, No Quantity)
import React from 'react';
import { Container, Row, Col, Card as BootstrapCard, Button, Form, ListGroup, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Components/CartContext';
import '../css/Cart.css';
import UserHeader from '../Components/Headers/userHeader';

// Placeholder - Make sure you have a real way to check login status
const isLoggedIn = () => !!localStorage.getItem('authToken');

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const total = subtotal;

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    if (cart.some(item => !item.sellerId)) {
      alert("Error: Cart contains items without seller information. Cannot proceed.");
      console.error("Cart items missing sellerId:", cart);
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const checkoutData = {
      cartItems: cart.map(item => ({
        productId: item.id || item.productId,
        sellerId: item.sellerId,
        price: item.price,
        sellerName: item.seller,
        productName: item.title,
      })),
      totalAmount: total,
    };

    console.log("Cart Checkout Data:", checkoutData);
    navigate('/payment', { state: checkoutData });
  };

  return (
    <>
      <UserHeader loginStatus={isLoggedIn()} />
      <Container className="mt-4 cart-container">
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <Alert variant="info">Your cart is empty.</Alert>
        ) : (
          <Row>
            {/* Cart Items Column */}
            <Col lg={8}>
              <ListGroup variant="flush">
                {cart.map((item) => (
                  <ListGroup.Item className="cart-item-card" key={item.id || item.productId}>
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fluid
                        />
                      </Col>
                      <Col xs={9} sm={5}>
                        <h5>{item.title}</h5>
                      </Col>
                      <Col xs={6} sm={2} className="text-end text-sm-start mt-2 mt-sm-0">
                        <p>${item.price.toFixed(2)}</p>
                      </Col>
                      <Col xs={6} sm={3} className="text-end mt-2 mt-sm-0">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemove(item.id || item.productId)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            {/* Summary Column */}
            <Col lg={4}>
              <div className="cart-summary">
                <h5>Summary</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </ListGroup.Item>
                </ListGroup>

                <div className="d-grid gap-2">
                  <Button variant="success" size="lg" onClick={handleCheckout}>Check Out</Button>
                  <Button variant="outline-danger" onClick={clearCart}>Clear Cart</Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default Cart;
