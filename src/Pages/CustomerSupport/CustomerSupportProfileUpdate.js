import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Form, Button,Spinner } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebars/CustomerSupportSidebar';
import CustomerSupportHeader from '../../Components/Headers/CustomerSupportHeader';
import { useNavigate } from 'react-router-dom';  
import "../../css/CustomerSupportProfileUpdate.css"

export default function CustomerSupportProfileUpdate() {
    const navigate = useNavigate();
    const { email } = useContext(AuthContext);  
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true); 
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
                    setIsLoading(true); // Set loading to true when fetch starts
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
                }finally {
                    setIsLoading(false); // Set loading to false when fetch completes
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
        const updateFormData = {
                username: profile.username,
                name: profile.name,
                dob: profile.dob,
                gender: profile.gender,
                phone: profile.phone,
        }
        const hasEmptyField = Object.values(updateFormData).some(value => !value?.toString().trim())

        if(hasEmptyField ){
            setErrorMessage("No Empty Input Field: Please Fill Up the Form")
        }else{
        try {
            setIsLoading(true); // Set loading to true when fetch starts
            // Send PUT request to update the user profile
            const response = await fetch(`/api/user/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateFormData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setProfile(updatedUser);
                setErrorMessage("")
                // Navigate back to the profile view
                navigate('/customer-support-profile');
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Failed to update profile");
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage("Error updating Profile");
        }finally{
            setIsLoading(false); 
        }
    }
    };

    return (
        <>
          <div className="d-flex flex-column min-vh-100">
            <CustomerSupportHeader />
            <Container fluid className="flex-grow-1">
                <Row className="h-100">
                    {/* Sidebar */}
                    <Col xs={12} md={3} lg={2} className="p-0 sidebar-col">
                        <Sidebar />
                    </Col>
        
                    {/* Form Area */}
                    <Col xs={12} md={9} lg={10} className="p-0">
                        <div className="form-wrapper p-4">
                            <div className="profile-update-container">
                                {isLoading ? (
                                <div className="text-center" style={{ marginTop: '100px' }}>
                                    <Spinner animation="border" role="status" variant="primary">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                    <p className="mt-2">Loading </p>
                                </div>
                            ) : (
                                <>
                                <h3 className="profile-title mb-3">Update Profile</h3>
                                <hr />
                                {/* Error Alert */}
                                {errorMessage && (
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
                                            disabled
                                            className="bg-light"
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
            
                                    <div className="text-center mt-4">
                                        <Button className="update-btn px-4 py-2" type="submit">
                                            Update Profile
                                        </Button>
                                    </div>
                                </Form>
                                </>
                            )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>   
    </>    
    );
    
}
