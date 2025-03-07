import React from 'react';  
import { Container, Row, Col, Navbar, Nav, Card, Button } from 'react-bootstrap';  
import { Link } from 'react-router-dom'; // Import Link  

const ShopPage = () => {  
    return (  
        <Container fluid className="p-4">  
            {/* Navbar */}  
            <Navbar bg="light" expand="lg">  
                <Navbar.Brand href="#home">Shop</Navbar.Brand>  
                <Navbar.Toggle aria-controls="basic-navbar-nav" />  
                <Navbar.Collapse id="basic-navbar-nav">  
                    <Nav className="me-auto">  
                        <Nav.Link href="#women">Women</Nav.Link>  
                        <Nav.Link href="#men">Men</Nav.Link>  
                        <Nav.Link href="#sell">Sell</Nav.Link>  
                    </Nav>  
                    <Nav>  
                        <Nav.Link href="#search">Search</Nav.Link>  
                        <Nav.Link href="#cart">Cart</Nav.Link>  
                    </Nav>  
                </Navbar.Collapse>  
            </Navbar>  

            {/* Features Section */}  
            <Row className="mt-4">  
                <Col md={3}>  
                    <h5>Features</h5>  
                    <ul>  
                        <li><a href="#shop-all">Shop All</a></li>  
                        <li><a href="#shop-women">Shop Women</a></li>  
                        <li><a href="#shop-men">Shop Men</a></li>  
                        <li><a href="#shop-shoes">Shop Shoes</a></li>  
                        <li><a href="#shop-under-20">Shop Under $20</a></li>  
                        <li><a href="#shop-top-under-10">Shop Top Under $10</a></li>  
                    </ul>  
                </Col>  

                {/* Product Cards Section */}  
                <Col md={9}>  
                    <Row>  
                        {[1, 2, 3, 4].map((item) => (  
                            <Col md={4} key={item} className="mb-4">  
                                <Link to="/productpage" style={{ textDecoration: 'none' }}> {/* Wrap Card with Link */}  
                                    <Card>  
                                        <Card.Img variant="top" src="https://via.placeholder.com/150" />  
                                        <Card.Body>  
                                            <Card.Title>Product Name</Card.Title>  
                                            <Card.Subtitle className="mb-2 text-muted">Product Brand</Card.Subtitle>  
                                            <Card.Text>Price: $XX.XX</Card.Text>  
                                            <Button variant="primary">Add to Cart</Button>  
                                        </Card.Body>  
                                    </Card>  
                                </Link>  
                            </Col>  
                        ))}  
                    </Row>  
                </Col>  
            </Row>  
        </Container>  
    );  
};  

export default ShopPage;  