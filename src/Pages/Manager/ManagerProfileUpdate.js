import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Form, Button,Spinner} from 'react-bootstrap';
import ManagerSidebar from '../../Components/Sidebars/ManagerSidebar';
import ManagerHeader from '../../Components/Headers/ManagerHeader';
import { useNavigate } from 'react-router-dom';  

export default function ManagerProfileUpdate() {
    const { email } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
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
                    setIsLoading(true)
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
                        setErrorMessage("Server Error: Please Refresh the Page")
                        console.error('Failed to fetch user details');
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }finally{
                    setIsLoading(false)
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
        const formData = {
                    username: profile.username,
                    name: profile.name,
                    dob: profile.dob,
                    gender: profile.gender,
                    phone: profile.phone,
                }
                const hasEmptyField = Object.values(formData).some(value => !value?.toString().trim())
            
                if(hasEmptyField ){
                    setErrorMessage("No Empty Input Field: Please Fill Up the Form")
                }else{
        try {
            // Send PUT request to update the user profile
            const response = await fetch(`/api/user/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Profile updated successfully:', updatedUser);
                // Optionally, you can set the updated user data back to the state
                setProfile(updatedUser);

                // Navigate back to the profile view
                navigate('/ManagerProfile');
            } else {
                console.error('Error updating profile');
            }
        } catch (error) {
            setErrorMessage("Server Error: Please Try Again")
            console.error('Error updating profile:', error);
        }finally{
            setIsLoading(false)
        }
    }
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
                    {isLoading ? (
                            <div className="text-center" style={{ marginTop: '100px' }}>
                                <Spinner animation="border" role="status" variant="primary">
                                    <span className="visually-hidden">Loading</span>
                                </Spinner>
                                <p className="mt-2">Loading...</p>
                            </div>
                        ) : (     <>              {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleChange}
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
                    </>)}
                </Col>
            </Row>
        </Container>
        </>
    );
}
