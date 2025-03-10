import React from "react";  
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from "react-bootstrap";  
import { Link } from "react-router-dom";  
import '../css/Header.css';  
import logo from '../images/logo.png';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons';

const Header = ({ isLoggedIn, LoggedAs }) => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                {LoggedAs !== "user" ? (
                    // Admin Header
                    <>
                        <Navbar.Brand style={{ color: 'black', marginLeft: '20px' }}>
                            <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'black' }} />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link href="/dashboard" style={{ color: 'white', marginBottom: '10px' }}>
                                    <House style={{ marginRight: '10px' }} /> Dashboard
                                </Nav.Link>
                                <Nav.Link href="/profile" style={{ color: 'white', marginBottom: '10px' }}>
                                    <Person style={{ marginRight: '10px' }} /> Profile
                                </Nav.Link>
                                <Nav.Link href="/view-accounts" style={{ color: 'white', marginBottom: '10px' }}>
                                    <Eye style={{ marginRight: '10px' }} /> View Account
                                </Nav.Link>
                                <Nav.Link href="/logout" style={{ color: 'white' }}>
                                    <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </>
                ) : (
                    // User Header
                    <>
                        <Navbar.Brand as={Link} className="logo">
                            <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavDropdown title="Shop" id="shop-dropdown">
                                    <NavDropdown.Item as={Link} to="/shoppage">Shop All</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/women">Women</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/men">Men</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link as={Link} to="/sell">Sell</Nav.Link>
                            </Nav>
                            {isLoggedIn && (
                                <Form className="d-flex">
                                    <FormControl
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                    />
                                    <Button variant="outline-light">Search</Button>
                                </Form>
                            )}
                            <Nav>
                                {isLoggedIn ? (
                                    <>
                                        <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                                        <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                        <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </>
                )}
            </Container>
        </Navbar>
    );
};

export default Header;
