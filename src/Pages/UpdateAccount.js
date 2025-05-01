import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import UserHeader from "../Components/Headers/userHeader";
import { useNavigate } from 'react-router-dom';  

export default function UpdateAccount({ email }) {
    const navigate = useNavigate();
    const [error, setError] = useState()
    const [profile, setProfile] = useState({
        username: '',
        name: '',
        email: '',
        dob: '',
        gender: '',
        phone: '',
        address: ''
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
                            phone: userData.phone,
                            address: userData.address
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
                    username: profile.username,
                    name: profile.name,
                    dob: profile.dob,
                    gender: profile.gender,
                    phone: profile.phone,
                    address: profile.address
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Profile updated successfully:', updatedUser);
                // Optionally, you can set the updated user data back to the state
                setProfile(updatedUser);

                // Navigate back to the profile view
                navigate('/user-profile');
            } else {
                console.error('Error updating profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <>
        <UserHeader loginStatus={true} />
        <Container fluid>
            <Row>
                <Col className="p-4 ms-5 me-5">
                    <h3 className='text-center' style={{ fontWeight: 'bold' , color: '#6f4e37'}}>Update Profile</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label style={{ fontWeight: 'bold'}}>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label style={{ fontWeight: 'bold'}}>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                disabled
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label style={{ fontWeight: 'bold'}}>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                disabled
                                
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="dob">
                            <Form.Label style={{ fontWeight: 'bold'}}>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={profile.dob}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gender">
                            <Form.Label style={{ fontWeight: 'bold'}}>Gender</Form.Label>
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
                            <Form.Label style={{ fontWeight: 'bold'}}>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label style={{ fontWeight: 'bold'}}>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center mt-4">
                            <Button
                                style={{ backgroundColor: '#6f4e37', borderColor: '#6f4e37' }}
                                type="submit"
                            >
                                Update Profile
                            </Button>
                        </div>

                    </Form>
                </Col>
            </Row>
        </Container>
        </>
    );
}
