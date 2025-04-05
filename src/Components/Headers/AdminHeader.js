import React, { useEffect, useState } from "react";  
import { Navbar, Nav, Container } from "react-bootstrap";  
import { House, Person, PersonAdd, BoxArrowRight } from 'react-bootstrap-icons'; // Adjust these imports based on your desired icons
import '../../css/Header.css';  
import logo from '../../images/logo.png';

export default function AdminHeader({ loginStatus }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(loginStatus);
    }, [loginStatus]);

    let getName = localStorage.getItem("name");

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand href="/view-all-accounts" style={{ color: 'black', marginLeft: '10px' }}>
                        <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'black' }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                        <Nav.Link href="/view-all-accounts" style={{ color: 'white', marginBottom: '10px' }}>
                                <House style={{ marginRight: '10px' }} /> Manage Accounts
                            </Nav.Link>
                            <Nav.Link href="/admin-profile" style={{ color: 'white', marginBottom: '10px' }}>
                                <Person style={{ marginRight: '10px' }} /> Profile
                            </Nav.Link>
                           <Nav.Link href="/create-account" style={{ color: 'white', marginBottom: '10px' }}>
                                           <PersonAdd style={{ marginRight: '10px' }} /> Create Account
                                       </Nav.Link>
                            <Nav.Link href="/logout" style={{ color: 'white' }}>
                                <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
