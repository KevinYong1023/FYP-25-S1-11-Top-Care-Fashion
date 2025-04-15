import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Card, Button,Spinner} from 'react-bootstrap';
import AdminHeader from "../../Components/Headers/AdminHeader";
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { email } = useContext(AuthContext); 
    const [isLoading, setIsLoading] = useState(false)

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
                    setError("Server Error, Please Refresh the Page")
                    console.log('Error fetching user details:', error);
                }finally{
                    setIsLoading(false)
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    function updateProfile() {
        navigate('/admin-profile-update');
    }

    return (
      <>
        <AdminHeader />
        <div style={{ display: 'flex', minHeight: '100vh', fontSize: '20px' }}>
          
          {/* Main Content */}
          <div
            style={{
              flex: 1,
              padding: '40px',
              backgroundColor: '#f0efeb',
              fontSize: '20px',
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
                  <h2 className="mb-4" style={{ color: '#6b705c', fontStyle: 'bold' }}>
                  Your Profile
                  </h2>
    
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
            )}
          </div>
        </div>
      </>
    );
    
};

export default AdminProfile;
