import React, { useState, useEffect } from "react";  
import { Container, Row, Col, Card } from 'react-bootstrap';  
import userData from '../../mockdata/users.json';  
import userpic from '../../images/profile.png';  
import Sidebar from "../../Components/Sidebar";  
import AuthorityHeader from "../../Components/Headers/authrotiyHeaders";  
import '../../css/StaffProfile.css'; // Ensure the CSS file is correctly linked   

const CustomerSupportProfile = ({ email, setName }) => {  
    const [user, setUser] = useState(null);  

    useEffect(() => {  
        const fetchedUser = userData.find((user) => user.email === email);   
        if (fetchedUser) {  
            setUser(fetchedUser);  
            setName(fetchedUser.name);  
        }  
    }, [email]);  

    // Check if user data is loaded before rendering  
    if (!user) {  
        return <p>Loading user data...</p>;  
    }  

    const handleSaveChanges = () => {  
        console.log("Save Changes button clicked.");  
        // You could also log user data or any changes made  
        console.log("User information:", user);  
        // Add any additional functionality for saving changes here  
    };  

    return (  
        <>  
            <AuthorityHeader />  
            <Container fluid>  
                <Row className="d-flex">  
                    {/* Sidebar - fixed width, no padding */}  
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>  
                        <Sidebar />  
                    </Col>  
                    <Col style={{ margin: '10px' }}>  
                        <h2 className="profile-title">Edit Profile</h2>  
                        <Card className="profile-card">  
                            <div className="profile-header">  
                                <img src={userpic} alt="Profile" className="profile-pic" />  
                            </div>  
                            <Row>  
                                <Col>  
                                    <h4>Username:</h4>  
                                    <p>{user.username}</p>  
                                    <h4>Name:</h4>  
                                    <p>{user.name}</p>  
                                    <h4>Email:</h4>  
                                    <p>{user.email}</p>  
                                </Col>  
                                <Col>  
                                    <h4>Date of Birth:</h4>  
                                    <p>{user.dob}</p>  
                                    <h4>Gender:</h4>  
                                    <p>{user.gender}</p>  
                                    <h4>Phone:</h4>  
                                    <p>{user.phone}</p>  
                                    <h4>Position:</h4>  
                                    <p>{user.position}</p>  
                                </Col>  
                            </Row>  
                            <div className="button-container">  
                            <button className="save-changes-btn" onClick={handleSaveChanges}>  
                                    Save Changes  
                                </button>  
</div>  
                        </Card>  
                    </Col>  
                </Row>  
            </Container>  
        </>  
    );  
};  

export default CustomerSupportProfile;  