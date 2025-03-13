import React from "react";  
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from "react-bootstrap";  
import { Link } from "react-router-dom";  
import '../../css/Header.css';  
import logo from '../../images/logo.png';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons';



export default function AuthorityHeader(){
    return(
        <>
          <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand style={{ color: 'black', marginLeft: '20px' }}>
                    <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'black' }} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href="/dashboard" style={{ color: 'white', marginBottom: '10px' }}>
                            <House style={{ marginRight: '10px' }} /> Dashboard
                        </Nav.Link>
                        <Nav.Link href="/customer-support-profile" style={{ color: 'white', marginBottom: '10px' }}>
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
                </Container>
            </Navbar>
        </>
    )
}