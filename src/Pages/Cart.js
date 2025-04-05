// src/Pages/Cart.js (No Quantity Version)
import React, { useState } from 'react';
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
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscountCode, setAppliedDiscountCode] = useState('');


  const subtotal = cart.reduce((total, item) => total + item.price, 0);


  // Calculate final total after discount
  const total = Math.max(0, subtotal - discountAmount); // Ensure total doesn't go below zero

  // Handler to remove item from cart
  const handleRemove = (itemId) => {
    removeFromCart(itemId);
    // Clear discount when items change, user must re-apply
    setDiscountAmount(0);
    setAppliedDiscountCode('');
  };

  // Handler to navigate to the payment/checkout page
  const handleCheckout = () => {
    // Check for sellerId remains critical
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
        productName:item.title,
      })),
      totalAmount: total, 
      
    };
    console.log("Cart Checkout Data:", checkoutData); // Check cart data
    // Navigate to payment page and pass checkoutData via location state
    navigate('/payment', { state: checkoutData });
  };

  // --- Discount Logic ---
  const handleApplyDiscount = () => {
    applyDiscount(discountCode);
  };

  const applyDiscount = (code) => {
    let discount = 0;
    // --- Recalculate current subtotal (no quantity) --- CHANGED
    const currentSubtotal = cart.reduce((total, item) => total + item.price, 0);
    // --- END CHANGE ---

    // Example discount codes (replace with your actual logic)
    if (code === 'SAVE10') {
      discount = currentSubtotal * 0.1;
    } else if (code === 'FLAT20') {
      discount = 20;
    } else if (code === 'FREE') {
        discount = currentSubtotal;
    } else {
      alert(`Invalid discount code: "${code}"`);
      setDiscountCode('');
      return;
    }

    discount = Math.min(discount, currentSubtotal); // Ensure discount <= subtotal
    setDiscountAmount(discount);
    setAppliedDiscountCode(code);
    if (discount > 0) {
        alert(`Discount code "${code}" applied!`);
    }
    setDiscountCode('');
  };
  // --- End Discount Logic ---


  // --- Render Component ---
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
                          src={item.imageUrl}  // <-- Provide the image source URL from the item object
                          alt={item.title}     // <-- Add descriptive alt text (good for accessibility)
                          fluid                // <-- Makes the image responsive (scales within the column
                        />
                      </Col>
                      <Col xs={9} sm={5}>
                        <h5>{item.title}</h5>
                        {/* <small>Sold by: {item.sellerName || 'Unknown'}</small> */}
                      </Col>
                      <Col xs={6} sm={2} className="text-end text-sm-start mt-2 mt-sm-0">
                        {/* --- Display only price (no quantity) --- CHANGED */}
                        <p>${item.price.toFixed(2)}</p>
                        {/* --- END CHANGE --- */}
                      </Col>
                      <Col xs={6} sm={3} className="text-end mt-2 mt-sm-0">
                        <Button variant="outline-danger" size="sm" onClick={() => handleRemove(item.id || item.productId)}>Remove</Button>
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
                   {/* Subtotal display (no quantity change needed here) */}
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </ListGroup.Item>
                   {/* Discount display */}
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Discount {appliedDiscountCode && `(${appliedDiscountCode})`}</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </ListGroup.Item>
                   {/* Total display */}
                  <ListGroup.Item className="d-flex justify-content-between">
                    <strong>Total</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </ListGroup.Item>
                </ListGroup>

                 {/* Discount Form */}
                <Form.Group controlId="discountCode" className="my-3">
                    { /* ... discount form controls ... */ }
                     <Form.Label>Discount / Promo Code</Form.Label>
                     <div className="d-flex">
                       <Form.Control type="text"/>
                       <Button variant="secondary" onClick={handleApplyDiscount}>Apply</Button>
                     </div>
                </Form.Group>

                 {/* Buttons */}
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