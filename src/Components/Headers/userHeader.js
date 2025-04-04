import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../css/Header.css';
import logo from '../../images/logo.png';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon

export default function UserHeader({ loginStatus }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        setIsLoggedIn(loginStatus);
    }, [loginStatus]); // Add loginStatus as a dependency

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <>
                    <Navbar.Brand as={Link} to="/home" className="logo">
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

                            <Nav.Link as={Link} to="/upload-product">Sell</Nav.Link>
                            <Nav.Link as={Link} to="/mixmatch">Mix & Match</Nav.Link>
                        </Nav>
                        
                        <Nav>
                            {isLoggedIn ? (
                                <NavDropdown title="Profile" id="profile-dropdown">
                                    <NavDropdown.Item as={Link} to="/user-profile">View Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/manage-list">Manage Listing</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/profit-page">Profit Dashboard</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </>
                            )}
                            <Nav.Link as={Link} to="/cart">
                                <FaShoppingCart />
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </>
            </Container>
        </Navbar>
    );
}
