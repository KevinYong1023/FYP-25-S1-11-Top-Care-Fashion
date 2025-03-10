import React from 'react';
import { Nav } from 'react-bootstrap';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons'; // or react-icons

export default function Sidebar(){
    return (
        <div style={{ 
            width: '250px', 
            height: '100vh', 
            backgroundColor: '#343a40',  // Lighter black (dark grey)
            padding: '20px', 
            boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
        }}>
          <Nav className="flex-column">
            <Nav.Link href="/dashboard" style={{ color: 'white', marginBottom: '10px' }}>
                <House style={{ marginRight: '10px' }} /> Dashboard
            </Nav.Link>
            <Nav.Link href="/profile" style={{ color: 'white', marginBottom: '10px' }}>
                <Person style={{ marginRight: '10px' }} /> Profile
            </Nav.Link>
            <Nav.Link href="/view-accounts" style={{ color: 'white', marginBottom: '10px' }}>
                <Eye style={{ marginRight: '10px' }} /> View Account
            </Nav.Link>
            <Nav.Link href="/logout" style={{ color: 'white', marginBottom: '10px' }}>
                <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
            </Nav.Link>
        </Nav>

        </div>
    );
};

