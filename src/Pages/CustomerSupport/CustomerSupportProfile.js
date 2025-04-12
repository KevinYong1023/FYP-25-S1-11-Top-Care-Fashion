import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Card, Button, Spinner} from 'react-bootstrap';
import Sidebar from "../../Components/Sidebars/CustomerSupportSidebar";
import CustomerSupportHeader from "../../Components/Headers/CustomerSupportHeader";
import { useNavigate } from 'react-router-dom';

const CustomerSupportProfile = () => {  
   const { email } = useContext(AuthContext); 
    const [user, setUser] = useState();  
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    // Fetch user details based on email
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    setIsLoading(true); // Start loading
                    const response = await fetch(`/api/user/${email}`); 
                    const data = await response.json();
                    setUser(data); 
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setIsLoading(false); // Stop loading in both success/failure
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    function updateProfile(){
        navigate('/customer-support-profile-update');  
    }

    return (
        <>
            <CustomerSupportHeader/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        <Sidebar/>
                    </Col>
                    {
                         isLoading ?  
                         <div className="text-center" style={{ marginTop: '100px' }}>
                                                        <Spinner animation="border" role="status" variant="primary">
                                                            <span className="visually-hidden">Loading</span>
                                                        </Spinner>
                                                        <p className="mt-2">Loading...</p>
                                                    </div>:
                    
                    <Col md={9} className="p-4">
                        <Card className={`p-4`}>
                            {
                                !user ? <></> 
                            :
                            <>
                            <h4>Username: {user.username}</h4>
                            <h4>Name: {user.name}</h4>
                            <h4>Email: {user.email}</h4>
                            <h4>Date of Birth: {user.dob}</h4>
                            <h4>Gender: {user.gender}</h4>
                            <h4>Phone: {user.phone}</h4>
                            </>
                        }
                        </Card>
                        <Button variant="primary" onClick={updateProfile}>Update Profile</Button>
                    </Col>
                    }
                </Row>
            </Container>
         </>
    );
};

export default CustomerSupportProfile;
