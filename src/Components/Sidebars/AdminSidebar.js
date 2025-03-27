import React from 'react';
import { Nav } from 'react-bootstrap';
import {Person, Eye, BoxArrowRight, Trash, PersonAdd, House} from 'react-bootstrap-icons'; 

export default function AdminSidebar(){

    return (
        <div style={{ 
            width: '220px', 
            height: '100%', 
            backgroundColor: '#343a40',  
            padding: '20px', 
            boxShadow: '2px 0 6px rgba(0, 0, 0, 0.2)',  
        }}>
            
        {/* Side bar for admin */}
        <Nav className="flex-column">
            <Nav.Link href="/view-all-accounts" style={{ color: 'white', marginBottom: '10px' }}>
                                            <House style={{ marginRight: '10px' }} /> View Accounts
                                        </Nav.Link>
                                        <Nav.Link href="/AdminDashboard" style={{ color: 'white', marginBottom: '10px' }}>
                                            <Person style={{ marginRight: '10px' }} /> Profile
                                        </Nav.Link>
                                       <Nav.Link href="/create-account" style={{ color: 'white', marginBottom: '10px' }}>
                                                       <PersonAdd style={{ marginRight: '10px' }} /> Create Account
                                                   </Nav.Link>
                                        <Nav.Link href="/logout" style={{ color: 'white' }}>
                                            <BoxArrowRight style={{ marginRight: '10px' }} /> Logout
                                        </Nav.Link>
           
        </Nav>

        </div>
    );
};

