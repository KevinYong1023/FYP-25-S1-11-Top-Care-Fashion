import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Card, Button,Spinner } from 'react-bootstrap';
import ManagerHeader from "../../Components/Headers/ManagerHeader"; 
import ManagerSideBar from "../../Components/Sidebars/ManagerSidebar";
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
        <div>
            <ManagerHeader />
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        <ManagerSideBar />
                    </Col>
                    <Col md={9} className="p-4">
                    {!error?<></>: <div className="alert alert-danger" role="alert">
                                  {error}
                                </div>}
                    {isLoading ? (
  <div className="text-center" style={{ marginTop: '100px' }}>
    <Spinner animation="border" role="status" variant="primary">
      <span className="visually-hidden">Loading</span>
    </Spinner>
    <p className="mt-2">Loading...</p>
  </div>
) : 
  (!user ? <></> : (
    <>
      <Card className="p-4">
        <h4>Username: {user.username}</h4>
        <h4>Name: {user.name}</h4>
        <h4>Email: {user.email}</h4>
        <h4>Date of Birth: {user.dob}</h4>
        <h4>Gender: {user.gender}</h4>
        <h4>Phone: {user.phone}</h4>
      </Card>
      <Button variant="primary" onClick={updateProfile}>Update Profile</Button>
    </>
  ))
}

                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ManagerProfile;
