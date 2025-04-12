import React, { useEffect, useState } from "react";  
import { Navbar, Nav, Container } from "react-bootstrap";  
import { Link } from "react-router-dom";  
import '../../css/Header.css';  
import logo from '../../images/logo.png';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons';

export default function ManagerHeader({loginStatus}){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(loginStatus);
    }, [loginStatus]);

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand href="/ManagerDashboard" style={{ color: 'black', marginLeft: '10px' }}>
                        <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'black' }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="/ManagerDashboard" style={{ color: 'white', marginBottom: '10px' }}>
                                <House style={{ marginRight: '10px' }} /> Dashboard
                            </Nav.Link>
                            <Nav.Link href="/ManagerProfile" style={{ color: 'white', marginBottom: '10px' }}>
                                <Person style={{ marginRight: '10px' }} /> Profile
                            </Nav.Link>
                            <Nav.Link href="/ManagerUsersDashboard" style={{ color: 'white', marginBottom: '10px' }}>
                                <Eye style={{ marginRight: '10px' }} /> User Accounts
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
