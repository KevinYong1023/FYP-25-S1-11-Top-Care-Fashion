import React, { useEffect, useState } from "react";  
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from "react-bootstrap";  
import { Link } from "react-router-dom";  
import '../../css/Header.css';  
import logo from '../../images/logo.png';


export default function AdminHeader(loginStatus){
   const [isLoggedIn, setIsLoggedIn] = useState(false)
       useEffect(()=>{
           setIsLoggedIn(loginStatus)
       },[])

    let getName = localStorage.getItem("name");
       return(
           <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
               <Container>
                   <>
                        <Navbar.Brand href="/view-all-accounts" className="logo">
                           <img src={logo} alt="logo" height={"50px"} width={"50px"} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ms-auto">
                                <div className="text-center p-3 text-white">
                                   <h1 className="m-0">Welcome Admin <br/> {getName}</h1>
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </>
               </Container>
   
           </Navbar>
   
       )
}