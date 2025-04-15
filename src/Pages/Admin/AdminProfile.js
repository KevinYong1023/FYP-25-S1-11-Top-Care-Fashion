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
                        <div style={{ display: 'flex', minHeight: '100vh' }}>
                          
                           {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center" style={{ marginTop: '100px' }}>
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading</span>
            </Spinner>
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          <>
            <Card className="p-4">
              {user && (
                <>
                  <h4>Username: {user.username}</h4>
                  <h4>Name: {user.name}</h4>
                  <h4>Email: {user.email}</h4>
                  <h4>Date of Birth: {user.dob}</h4>
                  <h4>Gender: {user.gender}</h4>
                  <h4>Phone: {user.phone}</h4>
                </>
              )}
            </Card>
            <Button variant="primary" onClick={updateProfile} className="mt-3">
              Update Profile
            </Button>
          </>
        )}
      </div>
    </div>
        </>
    );
};

export default AdminProfile;
