import React from 'react';
import { Nav } from 'react-bootstrap';
import { House, Person, Eye, BoxArrowRight } from 'react-bootstrap-icons'; // or react-icons

export default function ManagerSidebar(){
    return (
        <div style={{ 
            width: '250px', 
            height: '100vh', 
            backgroundColor: '#343a40',  // Lighter black (dark grey)
            padding: '20px', 
            boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)',  // Subtle shadow for depth
        }}>
          <Nav className="flex-column">
            <Nav.Link href="/ManagerDashboard" style={{ color: 'white', marginBottom: '10px' }}>
                <House style={{ marginRight: '10px' }} /> Manager Dashboard
            </Nav.Link>
            <Nav.Link href="/ManagerProfile" style={{ color: 'white', marginBottom: '10px' }}>
                <Person style={{ marginRight: '10px' }} /> Manager Profile
            </Nav.Link>
            <Nav.Link href="/ManagerUsersDashboard" style={{ color: 'white', marginBottom: '10px' }}>
                <Eye style={{ marginRight: '10px' }} /> Manager Users
            </Nav.Link>
            <Nav.Link href="/logout" style={{ color: 'white', marginBottom: '10px' }}>
                <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
            </Nav.Link>
        </Nav>

        </div>
    );
};