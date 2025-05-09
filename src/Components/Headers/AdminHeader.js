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
                      <Navbar expand="lg" className="custom-navbar">
            
                <Container>
                    <Navbar.Brand href="/view-all-accounts" >
                        <img src={logo} alt="logo" height={"100px"} width={"100px"} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'white' }} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                        <Nav.Link href="/view-all-accounts" style={{ color: 'white', marginBottom: '10px' , fontSize: '20px'}}>
                                <House style={{ marginRight: '10px'}} /> Dashboard
                            </Nav.Link>
                            <Nav.Link href="/admin-profile" style={{ color: 'white', marginBottom: '10px' , fontSize: '20px'}}>
                                <Person style={{ marginRight: '10px' }} /> Profile
                            </Nav.Link>
                           <Nav.Link href="/create-account" style={{ color: 'white', marginBottom: '10px' , fontSize: '20px'}}>
                                           <PersonAdd style={{ marginRight: '10px' }} /> Create Account
                                       </Nav.Link>
                            <Nav.Link href="/logout" style={{ color: 'white' }}>
                                <BoxArrowRight style={{ marginRight: '10px', fontSize: '20px' }} /> Logout
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}
