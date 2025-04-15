import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import UserHeader from '../Components/Headers/userHeader';
import { useNavigate } from 'react-router-dom';


const UserProfile = ({ email, setName, setAddress }) => {  
    const [user, setUser] = useState(null);  
    const navigate = useNavigate();
    const [revenue, setRevenue] = useState(0); // 🆕 New state for revenue

    // Fetch user details based on email
    useEffect(() => {
        const fetchUserDetails = async () => {
            console.log("Email:", email);
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`); 
                    const data = await response.json();
                    console.log("Data:", data);
                    setUser(data); 
                    setName(data.name);
                    setAddress(data.address);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [email]);

   /* // 🆕 Fetch revenue using user._id
    useEffect(() => {
        const fetchRevenue = async () => {
            if (user?._id) {
                try {
                    const response = await fetch(`/api/revenue/${user._id}`);
                    const data = await response.json();
                    setRevenue(data.revenue || 0);
                } catch (error) {
                    console.error("Error fetching revenue:", error);
                }
            }
        };
        fetchRevenue();
    }, [user?._id]); */

    function updateProfile(){
        navigate('/update-account');  
    }

    function checkOrders(){
        navigate('/your-orders');
    }

    // If user data is not loaded, show a loading message
    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <UserHeader loginStatus={true} />
            <Container fluid>
                <Row>
                    <Col md={9} className="p-4">
                        <Card className={`p-4`}>
                            <h2>Profile Details</h2>
                            <h4>Username: {user.username}</h4>
                            <h4>Name: {user.name}</h4>
                            <h4>Email: {user.email}</h4>
                            <h4>Date of Birth: {user.dob}</h4>
                            <h4>Gender: {user.gender}</h4>
                            <h4>Phone: {user.phone}</h4>
                        </Card>
                        
                        <Card className="p-4 mt-3">
                            <h2>Revenue Earned</h2>
                            <h3><strong>${user.revenue?.toFixed(2) || "0.00"}</strong></h3>
                        </Card>
                        <Card className="p-4">
                            <h2>Shipping Details</h2>
                            <h4>Name: {user.name}</h4>
                            <h4>Phone: {user.phone}</h4>
                            <h4>Email: {user.email}</h4>
                            <h4>Address: {user.address}</h4>
                        </Card>
                        <Button variant="primary" onClick={updateProfile}>Update Profile</Button>
                       
                        <Button variant="secondary" onClick={checkOrders}>Check Your Orders</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default UserProfile;
