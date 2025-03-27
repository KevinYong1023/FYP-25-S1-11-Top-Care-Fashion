import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import Sidebar from "../../Components/Sidebars/Sidebar";
import AuthorityHeader from "../../Components/Headers/CustomerSupportHeader";
import { useNavigate } from 'react-router-dom';

const CustomerSupportProfile = ({ email, setName }) => {  
    const [user, setUser] = useState(null);  
    const navigate = useNavigate();

    // Fetch user details based on email
    useEffect(() => {
        const fetchUserDetails = async () => {
            console.log("Email:", email);
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`); 
                    const data = await response.json();
                    setUser(data); 
                    setName(data.name);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    function updateProfile(){
        navigate('/customer-support-profile-update');  
    }

    // If user data is not loaded, show a loading message
    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <AuthorityHeader/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        <Sidebar/>
                    </Col>
                    <Col md={9} className="p-4">
                        <Card className={`p-4`}>
                            <h4>Username: {user.username}</h4>
                            <h4>Name: {user.name}</h4>
                            <h4>Email: {user.email}</h4>
                            <h4>Date of Birth: {user.dob}</h4>
                            <h4>Gender: {user.gender}</h4>
                            <h4>Phone: {user.phone}</h4>
                        </Card>
                        <Button variant="primary" onClick={updateProfile}>Update Profile</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CustomerSupportProfile;
