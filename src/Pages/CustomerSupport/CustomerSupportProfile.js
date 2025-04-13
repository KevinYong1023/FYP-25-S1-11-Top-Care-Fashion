import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Card, Button, Spinner} from 'react-bootstrap';
import CustomerSupportSidebar from "../../Components/Sidebars/CustomerSupportSidebar";
import CustomerSupportHeader from "../../Components/Headers/CustomerSupportHeader";
import { useNavigate } from 'react-router-dom';

const CustomerSupportProfile = () => {  
   const { email } = useContext(AuthContext); 
    const [user, setUser] = useState();  
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [error,setError] = useState("")

    // Fetch user details based on email
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    setIsLoading(true); // Start loading
                    const response = await fetch(`/api/user/${email}`); 
                    const data = await response.json();
                    setUser(data); 
                } catch (error) {
                    setError("Server Error: Please Refresh the Page");
                    console.error('Error fetching user details:', error);
                } finally {
                    setIsLoading(false); // Stop loading in both success/failure
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    function updateProfile(){
        navigate('/customer-support-profile-update');  
    }

    return (
        <>
        <CustomerSupportHeader />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                <CustomerSupportSidebar />
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px' }}>
                {isLoading ? (
                    <div className="text-center mt-5">
                        <Spinner animation="border" role="status" variant="primary" />
                        <p className="mt-2">Loading...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <Card className="p-4 shadow-sm">
                            <h3 className="mb-4">Your Profile</h3>
                            {user ? (
                                <>
                                    <p><strong>Username:</strong> {user.username}</p>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Date of Birth:</strong> {user.dob}</p>
                                    <p><strong>Gender:</strong> {user.gender}</p>
                                    <p><strong>Phone:</strong> {user.phone}</p>
                                </>
                            ) : (
                                <p>No user data found.</p>
                            )}
                        </Card>
                        <div className="mt-3">
                            <Button variant="primary" onClick={updateProfile}>
                                Update Profile
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    </>
    );
};

export default CustomerSupportProfile;
