import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Card, Button,Spinner } from 'react-bootstrap';
import ManagerHeader from "../../Components/Headers/ManagerHeader"; 
import { useNavigate } from 'react-router-dom';

const ManagerProfile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { email } = useContext(AuthContext); 
    const [isLoading, setIsLoading] = useState(false)
        const [error, setError] = useState("")

    // Fetch user details based on email
    useEffect(() => { 
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    setIsLoading(true)
                    const response = await fetch(`/api/user/${email}`);  // Assuming your API follows this route
                    const data = await response.json();
                    setUser(data); 
                } catch (error) {
                  setError("Server Error: Please Refresh the Page")
                    console.error('Error fetching user details:', error);
                }finally{
                    setIsLoading(false)
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    function updateProfile() {
        navigate('/ManagerProfileUpdate');
    }

    return (
      <>
        <ManagerHeader />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Main Content */}
          <div style={{ flex: 1, padding: '40px', backgroundColor: '#f0efeb' }}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
    
            {isLoading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading</span>
                </Spinner>
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              user && (
                <>
                  <Card
                    className="mb-4"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: '30px',
                    }}
                  >
                    <h2 className="mb-3">Your Profile                    </h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Date of Birth:</strong> {user.dob}</p>
                    <p><strong>Gender:</strong> {user.gender}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
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
                                        fontSize: '20px',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                      }}
                                    >
                                      Update Profile
                                    </Button>
                                  </div>
                </>
              )
            )}
          </div>
        </div>
      </>
    );
    
};

export default ManagerProfile;
