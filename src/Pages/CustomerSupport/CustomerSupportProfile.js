import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Card, Button, Spinner} from 'react-bootstrap';
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
          <div style={{ display: 'flex', minHeight: '100vh', fontSize: '20px' }}>
            {/* Main Content */}
            <div
              style={{
                flex: 1,
                padding: '40px',
                backgroundColor: '#f0efeb',
                fontSize: '20px', // Set a larger base font size
              }}
            >
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
      
                  {/* Profile Card */}
                  <Card
                    className="p-4 shadow-sm"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h2 className="mb-4" style={{ color: '#6e4f37',fontWeight:"bold"}}>Your Profile</h2>
      
                    {user ? (
                      <>
                        <p style={{ fontSize: '20px' }}><strong>Username:</strong> {user.username}</p>
                        <p style={{ fontSize: '20px' }}><strong>Name:</strong> {user.name}</p>
                        <p style={{ fontSize: '20px' }}><strong>Email:</strong> {user.email}</p>
                        <p style={{ fontSize: '20px' }}><strong>Date of Birth:</strong> {user.dob}</p>
                        <p style={{ fontSize: '20px' }}><strong>Gender:</strong> {user.gender}</p>
                        <p style={{ fontSize: '20px' }}><strong>Phone:</strong> {user.phone}</p>
                      </>
                    ) : (
                      <p>No user data found.</p>
                    )}
                  </Card>
      
                  {/* Update Profile Button */}
                  <div className="mt-4 d-flex justify-content-start">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={updateProfile}
                      style={{
                        backgroundColor: '#6b705c',
                        borderColor: '#6b705c',
                        fontSize: '20px', // Adjusted button font size
                        padding: '10px 20px',
                        borderRadius: '5px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
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
