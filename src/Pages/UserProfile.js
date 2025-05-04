import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import UserHeader from '../Components/Headers/userHeader';
import { useNavigate } from 'react-router-dom';

const UserProfile = ({ email, setName, setAddress }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [revenue, setRevenue] = useState(0); 

    useEffect(() => {
        const fetchUserDetails = async () => {
            //console.log("Email:", email);
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`);
                    const data = await response.json();
                    //console.log("Data:", data);
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

    function updateProfile() {
        navigate('/update-account');
    }

    function checkOrders() {
        navigate('/your-orders');
    }

    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <UserHeader loginStatus={true} />
            <Container fluid>
                <Row className="justify-content-center">
                    <Col md={8} className="p-4">
                        <Row>
                            <Col md={6}>
                                <Card className="p-4 mb-4 border-0 shadow">
                                    <h3 style={ {fontFamily: 'Math' , fontWeight:'bold' , color: '#6f4e37' }}>Profile Details</h3>
                                    <h4 style={ {fontFamily: 'Math' }}>Username: {user.username}</h4>
                                    <h4 style={ { fontFamily: 'Math' }}>Name: {user.name}</h4>
                                    <h4 style={ { fontFamily: 'Math' }}>Email: {user.email}</h4>
                                    <h4 style={ { fontFamily: 'Math' }}>Date of Birth: {user.dob}</h4>
                                    <h4 style={ { fontFamily: 'Math' }}>Gender: {user.gender}</h4>
                                    <h4 style={ { fontFamily: 'Math' }}>Phone: {user.phone}</h4>
                                </Card>
                            </Col>
                            <Col>
                            <Card className="p-4 mb-4 border-0 shadow">
                            <h3 style={ {fontFamily: 'Math' , fontWeight:'bold' , color: '#6f4e37' }}>Revenue Earned</h3>
                            <h4 className="revenue-amount">${user.revenue?.toFixed(2) || "0.00"}</h4>
                            </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="p-4 mb-4 border-0 shadow">
                                    <h3 style={ {fontFamily: 'Math' , fontWeight:'bold' , color: '#6f4e37' }}>Shipping Details</h3>
                                    <h4 style={ {fontFamily: 'Math' }}>Name: {user.name}</h4>
                                    <h4 style={ {fontFamily: 'Math' }}>Phone: {user.phone}</h4>
                                    <h4 style={ {fontFamily: 'Math' }}>Email: {user.email}</h4>
                                    <h4 style={ {fontFamily: 'Math' }}>Address: {user.address}</h4>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col className="d-flex justify-content-center gap-3">
                                <Button
                                style={{ backgroundColor: '#6f4e37', borderColor: '#6f4e37' }}
                                onClick={updateProfile}
                                >
                                Update Profile
                                </Button>
                                <Button
                                style={{ backgroundColor: '#6f4e37', borderColor: '#6f4e37' }}
                                onClick={checkOrders}
                                >
                                Check Your Orders
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default UserProfile;
