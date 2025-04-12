import React, { useEffect,useState } from "react";  
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from "react-bootstrap";  
import { Link } from "react-router-dom";  
import '../../css/Header.css';  
import logo from '../../images/logo.png';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons';

export default function ManagerHeader({loginStatus}){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    useEffect(()=>{
        setIsLoggedIn(loginStatus)
    },[])
    return(
        <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
            <Container>
                <>
                        <Navbar.Brand href="/ManagerDashboard" as={Link} className="logo">
                            <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <div className="text-center p-3 text-white">
                                    <h1 className="m-0">Manager</h1>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </>
            </Container>

        </Navbar>

    )
}