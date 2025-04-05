import React, { useEffect, useState, useContext} from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import {AuthContext} from '../../App';
import { Link } from "react-router-dom";
import '../../css/Header.css';
import logo from '../../images/logo.png';
import { FaShoppingCart } from 'react-icons/fa';

export default function UserHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   const { login } = useContext(AuthContext ); 
  useEffect(() => {
    setIsLoggedIn(login);
  }, [login]);
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
            <NavDropdown title="Shop" id="shop-dropdown" style={{fontSize: '20px'}}>
              <NavDropdown.Item as={Link} to="/shoppage">Shop All</NavDropdown.Item>
            </NavDropdown>

          {
            isLoggedIn &&(
              <>
                <Nav.Link as={Link} to="/upload-product" style={{fontSize: '20px'}}>Sell</Nav.Link>
            <Nav.Link as={Link} to="/mixmatch" style={{fontSize: '20px'}}>Mix & Match</Nav.Link></>
            )
          }
          
          </Nav>

          <Nav className="align-items-center"> {/* Added align-items-center for vertical alignment */}
            {isLoggedIn ? (
              <>
                <NavDropdown title="Profile" id="profile-dropdown" style={{fontSize: '20px'}}>
                  <NavDropdown.Item as={Link} to="/user-profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/manage-list">Manage Listings</NavDropdown.Item>
                  {/* Add Order History Link? */}
                   <NavDropdown.Item as={Link} to="/order-history">Order History</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/logout" style={{fontSize: '20px'}}>Logout</Nav.Link>
                <Nav.Link as={Link} to="/cart" style={{ fontSize: '20px'}}>
                  <FaShoppingCart />
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{fontSize: '20px'}}>Login</Nav.Link>
                <Nav.Link as={Link} to="/register" style={{fontSize: '20px'}}>Register</Nav.Link>
              </>
            )}
          </Nav>

        </Navbar.Collapse>
      </>
      </Container>
    </Navbar>
  );
}