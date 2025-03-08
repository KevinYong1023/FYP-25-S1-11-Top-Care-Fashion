import React from 'react';  
import { Container, Row, Col, Navbar, Nav, Card, Button,ListGroup  } from 'react-bootstrap';  
import { Link } from 'react-router-dom'; // Import Link  
import noproduct from '../images/NoProduct.jpg';

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
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title className="text-primary">Features</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item action href="#shop-all" className="text-secondary">
                            Shop All
                        </ListGroup.Item>
                        <ListGroup.Item action href="#shop-women" className="text-secondary">
                            Shop Women
                        </ListGroup.Item>
                        <ListGroup.Item action href="#shop-men" className="text-secondary">
                            Shop Men
                        </ListGroup.Item>
                        <ListGroup.Item action href="#shop-shoes" className="text-secondary">
                            Shop Shoes
                        </ListGroup.Item>
                        <ListGroup.Item action href="#shop-under-20" className="text-secondary">
                            Shop Under $20
                        </ListGroup.Item>
                        <ListGroup.Item action href="#shop-top-under-10" className="text-secondary">
                            Shop Top Under $10
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Col>
                {/* Product Cards Section */}  
                <Col md={9}>  
                    <Row>  
                        {[1, 2, 3, 4].map((item) => (  
                            <Col md={4} key={item} className="mb-4">  
                                <Link to="/productpage" style={{ textDecoration: 'none' }}> {/* Wrap Card with Link */}  
                                    <Card>  
                                        <Card.Img variant="top" src={noproduct}/>  
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