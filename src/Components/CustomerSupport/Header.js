import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons'; // or react-icons

export default function Header(){
    return (
        <Navbar bg="light" expand="lg" style={{ padding: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <Navbar.Brand href="/dashboard" style={{ color: 'black', marginLeft: '20px' }}>
                LOGO {/* Placeholder for your logo */}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'black' }} />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                     <Nav.Link href="/dashboard" style={{ color: 'black', marginBottom: '10px' }}>
                                    <House style={{ marginRight: '10px' }} /> Dashboard
                    </Nav.Link>
                    <Nav.Link href="/profile" style={{ color: 'black', marginBottom: '10px' }}>
                        <Person style={{ marginRight: '10px' }} /> Profile
                    </Nav.Link>
                    <Nav.Link href="/view-accounts" style={{ color: 'black', marginBottom: '10px' }}>
                        <Eye style={{ marginRight: '10px' }} /> View Account
                    </Nav.Link>
                    <Nav.Link href="/logout" style={{ color: 'black'}}>
                        <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};
