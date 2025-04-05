// src/Components/Headers/userHeader.js

import React, { useEffect, useState, useContext } from "react"; // Added useContext if needed for AuthContext later
import { Navbar, Nav, NavDropdown, Container, Badge } from "react-bootstrap"; // <-- Added Badge
import { Link } from "react-router-dom";
import '../../css/Header.css'; // Ensure path is correct
import logo from '../../images/logo.png'; // Ensure path is correct
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../CartContext'; // <-- Added useCart import (Adjust path if needed)
// import { AuthContext } from "../App"; // Keep if you use AuthContext for login status

export default function UserHeader({ loginStatus }) { // loginStatus prop might be replaced by context later
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state based on prop

  // --- Get Cart State ---
  const { cart } = useCart(); // Get cart array from context

  // --- Calculate Item Count ---
  // Sums up the 'quantity' of each item, defaulting to 1 if quantity is missing
  const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);

  // Update local login state when prop changes
  useEffect(() => {
    setIsLoggedIn(loginStatus);
  }, [loginStatus]);

  // Function to determine login status (maybe better handled by context)
  // const { isLoggedIn } = useContext(AuthContext); // Alternative using context

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

          <Nav className="align-items-center"> {/* Added align-items-center for vertical alignment */}
            {isLoggedIn ? (
              <>
                {/* --- MODIFIED Cart Link --- */}
                <Nav.Link as={Link} to="/cart" className="position-relative me-2"> {/* Added position-relative & margin */}
                  <FaShoppingCart style={{ fontSize: '1.4rem' }} />
                  {itemCount > 0 && ( // Conditionally render Badge
                    <Badge
                      pill
                      bg="danger"
                      className="cart-item-count-badge"
                      style={{
                        position: 'absolute',
                        top: '-5px',      // Adjust vertical position
                        right: '-10px',   // Adjust horizontal position
                        fontSize: '0.7em',
                        // Add more styles as needed
                      }}
                    >
                      {itemCount > 99 ? '99+' : itemCount} {/* Show count, cap at 99+ */}
                    </Badge>
                  )}
                </Nav.Link>
                {/* --- END MODIFICATION --- */}

                <NavDropdown title="Profile" id="profile-dropdown">
                  <NavDropdown.Item as={Link} to="/user-profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/manage-list">Manage Listings</NavDropdown.Item>
                  {/* Add Order History Link? */}
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