import React, { useState } from 'react';  
import { Container, Row, Col, Navbar, Nav, Card, Button, ListGroup, Form, FormControl } from 'react-bootstrap';  
import { Link } from 'react-router-dom';  
import noproduct from '../images/NoProduct.jpg';
import UserHeader from '../Components/Headers/userHeader';

const ShopPage = ({ loginStatus }) => { 
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const products = [
        { id: 1, name: "Product A", brand: "Brand X", price: "$19.99" },
        { id: 2, name: "Product B", brand: "Brand Y", price: "$24.99" },
        { id: 3, name: "Product C", brand: "Brand Z", price: "$15.99" },
        { id: 4, name: "Product D", brand: "Brand X", price: "$29.99" }
    ];

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
    );

    return (  
        <>
        <UserHeader loginStatus={loginStatus} />
        <Container fluid className="p-4">  
            {/* Navbar with Search Bar */}  
            <Navbar bg="light" expand="lg">  
                <Navbar.Brand href="#home">Shop</Navbar.Brand>  
                <Navbar.Toggle aria-controls="basic-navbar-nav" />  
                <Navbar.Collapse id="basic-navbar-nav">  
                    <Nav className="me-auto">  
                        <Nav.Link href="#women">Women</Nav.Link>  
                        <Nav.Link href="#men">Men</Nav.Link>  
                        <Nav.Link href="#sell">Sell</Nav.Link>  
                    </Nav>  
                    {/* Search Bar in Navbar */}
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search products..."
                            className="me-2"
                            onChange={handleSearch}
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>  
            </Navbar>  

            {/* Features Section */}  
            <Row className="mt-4">  
                <Col md={3}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title className="text-primary">Features</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item action href="#shop-all" className="text-secondary">Shop All</ListGroup.Item>
                                <ListGroup.Item action href="#shop-women" className="text-secondary">Shop Women</ListGroup.Item>
                                <ListGroup.Item action href="#shop-men" className="text-secondary">Shop Men</ListGroup.Item>
                                <ListGroup.Item action href="#shop-shoes" className="text-secondary">Shop Shoes</ListGroup.Item>
                                <ListGroup.Item action href="#shop-under-20" className="text-secondary">Shop Under $20</ListGroup.Item>
                                <ListGroup.Item action href="#shop-top-under-10" className="text-secondary">Shop Top Under $10</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Product Cards Section */}  
                <Col md={9}>  
                    <Row>  
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (  
                                <Col md={4} key={product.id} className="mb-4">  
                                    <Link to="/productpage" style={{ textDecoration: 'none' }}>  
                                        <Card>  
                                            <Card.Img variant="top" src={noproduct}/>  
                                            <Card.Body>  
                                                <Card.Title>{product.name}</Card.Title>  
                                                <Card.Subtitle className="mb-2 text-muted">{product.brand}</Card.Subtitle>  
                                                <Card.Text>Price: {product.price}</Card.Text>  
                                                <Button variant="primary">View Product</Button>  
                                            </Card.Body>  
                                        </Card>  
                                    </Link>  
                                </Col>  
                            ))
                        ) : (
                            <Col md={12}>
                                <p className="text-muted text-center">No products found.</p>
                            </Col>
                        )}
                    </Row>  
                </Col>  
            </Row>  
        </Container>  
        </>
    );  
};  

export default ShopPage;
