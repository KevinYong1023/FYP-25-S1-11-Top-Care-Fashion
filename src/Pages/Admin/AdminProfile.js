import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import AdminHeader from "../../Components/Headers/AdminHeader";
import AdminSideBar from "../../Components/Sidebars/AdminSidebar";
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
   const { email } = useContext(AuthContext); 

    // Fetch user details based on email
    useEffect(() => {
        const fetchUserDetails = async () => {
            console.log("Email:", email);
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`);  // Assuming your API follows this route
                    const data = await response.json();
                    setUser(data);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    function updateProfile() {
        navigate('/admin-profile-update');
    }

    // Show loading message until user data is loaded
    if (!user) {
        return <p>Loading user data...</p>;
    }

    return (
        <div>
            <AdminHeader />
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        <AdminSideBar />
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

export default AdminProfile;
