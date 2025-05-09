import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Form, Button,Spinner} from 'react-bootstrap';
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
                //console.log('Profile updated successfully:', updatedUser);
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
          <ManagerHeader />
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', backgroundColor: '#f0efeb' }}>
              {isLoading ? (
                <div className="text-center mt-5">
                  <Spinner animation="border" role="status" variant="primary" />
                  <p className="mt-2">Loading...</p>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '20px',
                  }}
                >
                  <h2 className="mb-4" style={{ color: '#6e4f37', fontWeight: 'bold'}}>Update Profile</h2>
                  <hr />
                  {errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )}
      
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username" style={{ fontSize: '20px'}}>
                      <Form.Label style={{ fontWeight: 'bold'}}>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={profile.username}
                        onChange={handleChange}
                      />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="name" style={{ fontSize: '20px'}}>
                      <Form.Label style={{ fontWeight: 'bold'}}>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled
                      />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="email" style={{ fontSize: '20px'}}>
                      <Form.Label style={{ fontWeight: 'bold'}}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={profile.email}
                        disabled
                        className="bg-light"
                      />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="dob" style={{ fontSize: '20px'}}>
                      <Form.Label style={{ fontWeight: 'bold'}}>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                      />
                    </Form.Group>
      
                    <Form.Group className="mb-3" controlId="gender" style={{ fontSize: '20px'}}>
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
      
                    <Form.Group className="mb-3" controlId="phone" style={{ fontSize: '20px'}}>
                      <Form.Label style={{ fontWeight: 'bold'}}>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>
      
                    <div className="text-center mt-4">
                      <Button
                        type="submit"
                        className="w-100"
                        style={{
                          backgroundColor: '#6b705c',
                          borderColor: '#6b705c',
                          fontSize: '20px',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Update Profile
                      </Button>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </>
      );
      
      
}
