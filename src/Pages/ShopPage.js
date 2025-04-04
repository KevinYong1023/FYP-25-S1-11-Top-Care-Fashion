import React, { useState } from 'react';  
import { Container, Row, Col, Navbar, Nav, Card, Button, Form, FormControl } from 'react-bootstrap';  
import { Link } from 'react-router-dom';  
import noproduct from '../images/NoProduct.jpg';
import UserHeader from '../Components/Headers/userHeader';
import "../css/ShopPage.css";

const ShopPage = ({ loginStatus }) => { 
    console.log(loginStatus);
    
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Search for:", searchTerm);
        // Add search functionality here
    };

    return (  
        <>
            <UserHeader loginStatus={loginStatus} />
            <Container fluid className="p-4">  
                {/* Navbar with Features and Search Bar */}  
                <Navbar bg="light" expand="lg" className="mb-4">  
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />  
                    <Navbar.Collapse id="basic-navbar-nav">  
                        <Nav className="me-auto">  
                            <Nav.Link href="#shop-all">Shop All</Nav.Link>  
                            <Nav.Link href="#women">Women</Nav.Link>  
                            <Nav.Link href="#men">Men</Nav.Link>  
                            <Nav.Link href="#sell">Sell</Nav.Link>  
                            <Nav.Link href="#shoes">Shoes</Nav.Link>  
                            <Nav.Link href="#shop-under-20">Under $20</Nav.Link>  
                            <Nav.Link href="#shop-under-10">Under $10</Nav.Link>  
                        </Nav>  
                        {/* Search Bar */}
                        <Form className="d-flex" onSubmit={handleSearch}>
                            <FormControl  
                                type="search"  
                                placeholder="Search"  
                                className="me-2"  
                                aria-label="Search"  
                                value={searchTerm}  
                                onChange={(e) => setSearchTerm(e.target.value)}  
                            />  
                            <Button className="custom-search-button" type="submit">Search</Button>  
                        </Form>  
                    </Navbar.Collapse>  
                </Navbar>  

                {/* Product Cards Section */}  
                <Row>  
                    {[1, 2, 3, 4].map((item) => (  
                        <Col md={3} key={item} className="mb-4">  
                            <Link to="/productpage" style={{ textDecoration: 'none' }}>  
                                <Card>  
                                    <Card.Img variant="top" src={noproduct} />  
                                    <Card.Body>  
                                        <Card.Title>Product Name</Card.Title>  
                                        <Card.Subtitle className="mb-2 text-muted">Product Brand</Card.Subtitle>  
                                        <Card.Text>Price: $XX.XX</Card.Text>  
                                        <Button className="custom-view-button">View Product</Button>  
                                    </Card.Body>  
                                </Card>  
                            </Link>  
                        </Col>  
                    ))}  
                </Row>  
            </Container>  
        </>
    );  
};  

export default ShopPage;
