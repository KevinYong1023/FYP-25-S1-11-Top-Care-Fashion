// src/Components/Headers/userHeader.js

import React, { useEffect, useState, useContext } from "react";
import { Navbar, Nav, NavDropdown, Container, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../css/Header.css';
import logo from '../../images/logo.png';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../CartContext';

export default function UserHeader({ loginStatus }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { cart } = useCart();

    // Calculate item count without quantity
    const itemCount = cart.length;

    useEffect(() => {
        setIsLoggedIn(loginStatus);
    }, [loginStatus]);

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
                            </NavDropdown>
                            <Nav.Link as={Link} to="/upload-product">Sell</Nav.Link>
                            <Nav.Link as={Link} to="/mixmatch">Mix & Match</Nav.Link>
                        </Nav>

                        <Nav className="align-items-center">
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link as={Link} to="/cart" className="position-relative me-2">
                                        <FaShoppingCart style={{ fontSize: '1.4rem' }} />
                                        {itemCount > 0 && (
                                            <Badge
                                                pill
                                                bg="danger"
                                                className="cart-item-count-badge"
                                                style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-10px',
                                                    fontSize: '0.7em',
                                                }}
                                            >
                                                {itemCount > 99 ? '99+' : itemCount}
                                            </Badge>
                                        )}
                                    </Nav.Link>

                                    <NavDropdown title="Profile" id="profile-dropdown">
                                        <NavDropdown.Item as={Link} to="/user-profile">Profile</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/manage-list">Manage Listings</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/order-history">Order History</NavDropdown.Item>
                                    </NavDropdown>
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
            </Container>
        </Navbar>
    );
}