import React from "react";  
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from "react-bootstrap";  
import { Link } from "react-router-dom";  
import './Header.css'; // Import custom CSS for additional styling  
import logo from '../../images/logo.png';

const Header = () => {  
    return (  
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">  
            <Container>  
                <Navbar.Brand as={Link} to="/" className="logo">  
                    <img src={logo} alt="logo" height={"50px"} width={"50px"}/>
                </Navbar.Brand>  
                <Navbar.Toggle aria-controls="basic-navbar-nav" />  
                <Navbar.Collapse id="basic-navbar-nav">  
                    <Nav className="me-auto">  
                        <Nav.Link as={Link} to="/sell">Sell</Nav.Link>  
                        <NavDropdown title="Shop" id="shop-dropdown">  
                            <NavDropdown.Item as={Link} to="/shoppage">Shop All</NavDropdown.Item>  
                            <NavDropdown.Item as={Link} to="/women">Women</NavDropdown.Item>  
                            <NavDropdown.Item as={Link} to="/men">Men</NavDropdown.Item>  
                        </NavDropdown>  
                        <NavDropdown title="Features" id="features-dropdown">  
                            <NavDropdown.Item as={Link} to="/shop-under-20">Shop Under $20</NavDropdown.Item>  
                            <NavDropdown.Item as={Link} to="/shop-top-under-10">Shop Top Under $10</NavDropdown.Item>  
                            <NavDropdown.Item as={Link} to="/shop-shoes">Shop Shoes</NavDropdown.Item>  
                        </NavDropdown>  
                    </Nav>  
                    <Form className="d-flex">  
                        <FormControl  
                            type="search"  
                            placeholder="Search"  
                            className="me-2"  
                            aria-label="Search"  
                        />  
                        <Button variant="outline-light">Search</Button>  
                    </Form>  
                    <Nav>  
                        <Nav.Link as={Link} to="/register">Register</Nav.Link>  
                        <Nav.Link as={Link} to="/login">Login</Nav.Link>  
                    </Nav>  
                </Navbar.Collapse>  
            </Container>  
        </Navbar>  
    );  
};  

export default Header;  