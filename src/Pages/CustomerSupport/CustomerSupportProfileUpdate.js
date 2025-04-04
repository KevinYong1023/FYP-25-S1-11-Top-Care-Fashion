import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';
import { useNavigate } from 'react-router-dom';
import "../../css/CustomerSupportProfileUpdate.css"

export default function CustomerSupportProfileUpdate({ email }) {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        username: '',
        name: '',
        email: '',
        dob: '',
        gender: '',
        phone: ''
    });

    // Fetch user data from the backend on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setProfile({
                            username: userData.username,
                            name: userData.name,
                            email: userData.email,
                            dob: userData.dob,
                            gender: userData.gender,
                            phone: userData.phone
                        });
                    } else {
                        console.error('Failed to fetch user details');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };

        fetchUserDetails();
    }, [email]);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission and update user details in the backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Send PUT request to update the user profile
            const response = await fetch(`/api/user/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: profile.name,
                    dob: profile.dob,
                    gender: profile.gender,
                    phone: profile.phone,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Profile updated successfully:', updatedUser);
                setProfile(updatedUser);
                navigate('/customer-support-profile');
            } else {
                console.error('Error updating profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
        <AuthorityHeader/>
        <Container fluid>
            <Row>
                <Col xs={12} md={8} className="mx-auto p-4"> {/* Centered Form */}
                <h3 className="profile-title">Update Profile</h3>
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
                                disabled
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

                        <Button type="submit" className="update-btn">
                            Update Profile
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
}
