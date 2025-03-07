import React, { useState } from 'react';  
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';  
import 'bootstrap/dist/css/bootstrap.min.css';  

const ProductPage = () => {  
    const [reviews, setReviews] = useState([]);  
    const [newReview, setNewReview] = useState({  
        buyerName: '',  
        description: '',  
    });  
    const [showModal, setShowModal] = useState(false);  
    const [selectedUser, setSelectedUser] = useState(null);  

    const handleSubmit = (e) => {  
        e.preventDefault();  
        setReviews([...reviews, { ...newReview, id: Date.now() }]);  
        setNewReview({ buyerName: '', description: '' });  
    };  

    const handleShow = (buyerName) => {  
        setSelectedUser(buyerName);  
        setShowModal(true);  
    };  

    const handleClose = () => {  
        setShowModal(false);  
        setSelectedUser(null);  
    };  

    return (  
        <Container className="mt-4">  
            <Row>  
                <Col md={4} className="d-flex flex-column align-items-center">  
                    <Card className="mb-4" style={{ width: '100%' }}>  
                        <Card.Img variant="top" src="https://via.placeholder.com/150" />  
                    </Card>  
                </Col>  

                <Col md={8}>  
                    <Card className="mb-4">  
                        <Card.Body>  
                            <Card.Title>Product Brand</Card.Title>  
                            <Card.Subtitle className="mb-2 text-muted">Product Name</Card.Subtitle>  
                            <Card.Text>Price: $XX.XX</Card.Text>  
                            <Card.Text>Description:</Card.Text>  
                            <Form.Control as="textarea" rows={3} placeholder="Product description" />  
                            <Button variant="primary" className="mt-2">Add to Cart</Button>  
                        </Card.Body>  
                    </Card>  
                </Col>  
            </Row>  

            <Row className="mt-4">  
                <Col>  
                    <h4>Reviews</h4>  
                    {reviews.map((review) => (  
                        <Card key={review.id} className="mb-2">  
                            <Card.Body>  
                                <Card.Title>  
                                    <Button variant="link" onClick={() => handleShow(review.buyerName)}>  
                                        {review.buyerName}  
                                    </Button>  
                                    <span className="text-muted"> - Date of Review</span>  
                                </Card.Title>  
                                <Card.Text>{review.description}</Card.Text>  
                                <Button variant="link">Reply</Button>  
                                <Button variant="link" className="text-danger">Delete</Button>  
                            </Card.Body>  
                        </Card>  
                    ))}  
                    <Form onSubmit={handleSubmit} className="mt-4">  
                        <Form.Group controlId="formBasicName">  
                            <Form.Label>Your Name</Form.Label>  
                            <Form.Control  
                                type="text"  
                                placeholder="Enter your name"  
                                value={newReview.buyerName}  
                                onChange={(e) => setNewReview({ ...newReview, buyerName: e.target.value })}  
                                required  
                            />  
                        </Form.Group>  
                        <Form.Group controlId="formBasicComment">  
                            <Form.Label>Your Comment</Form.Label>  
                            <Form.Control  
                                as="textarea"  
                                rows={3}  
                                placeholder="Write your comment..."  
                                value={newReview.description}  
                                onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}  
                                required  
                            />  
                        </Form.Group>  
                        <Button variant="primary" type="submit">Submit Comment</Button>  
                    </Form>  
                </Col>  
            </Row>  

            {/* Modal for User Profile */}  
            <Modal show={showModal} onHide={handleClose}>  
                <Modal.Header closeButton>  
                    <Modal.Title>{selectedUser}</Modal.Title>  
                </Modal.Header>  
                <Modal.Body>  
                    <div className="text-center">  
                        <img src="https://via.placeholder.com/100" alt="Profile" className="rounded-circle mb-3" />  
                        <h5>{selectedUser}</h5>  
                        <Button variant="secondary" className="me-2">View Profile</Button>  
                        <Button variant="secondary">Chat</Button>  
                    </div>  
                    <p className="mt-3">Customer Support</p>  
                </Modal.Body>  
            </Modal>  

            <footer className="text-center mt-4">  
                <Button variant="secondary" className="me-2"></Button>  
                <Button variant="secondary"></Button>  
                <p className="mt-2">Customer Support</p>  
            </footer>  
        </Container>  
    );  
};  

export default ProductPage;  