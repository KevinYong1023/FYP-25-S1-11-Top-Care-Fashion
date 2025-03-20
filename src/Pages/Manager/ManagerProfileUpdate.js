import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import userData from '../../mockdata/users.json'; // Import mock data
import ManagerSidebar from '../../Components/Sidebars/ManagerSidebar';
import ManagerHeader from '../../Components/Headers/ManagerHeader';
import { useNavigate } from 'react-router-dom';  

export default function ManagerProfileUpdate({ email }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        name: '',
        email: '',
        dob: '',
        gender: '',
        phone: ''
    });

    // Fetch user data on component mount
    useEffect(() => {
        const user = userData.find((user) => user.email === email);
        if (user) {
            setProfile({
                username: user.username,
                name: user.name,
                email: user.email,
                dob: user.dob,
                gender: user.gender,
                phone: user.phone
            });
        }
    }, [email]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        alert("MANAGER UPDATED");
        e.preventDefault();
    
        // Remove the old user by filtering out their entry
        const updatedUsers = userData.filter(user => user.email !== profile.email);
    
        // Add the updated profile to the list
        updatedUsers.push(profile);
    
        // Log or manage the updated users array (in-memory update)
        console.log('Updated Users:', updatedUsers);
    
        // Navigate back to the profile view
        navigate('/ManagerProfile');  
    };

    return (
        <>
        <ManagerHeader/>
        <Container fluid>
            <Row>
                <Col xs={12} md={3} className="p-0">
                    <ManagerSidebar/>
                </Col>
                <Col md={9} className="p-4">
                    <h3>Update Profile</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={profile.username}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="dob">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={profile.dob}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                
                            >
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Update Profile
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
}