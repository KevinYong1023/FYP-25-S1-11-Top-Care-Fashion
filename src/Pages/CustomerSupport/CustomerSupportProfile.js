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
                                    <h3>Username:</h3>  
                                    <p>{user.username}</p>  
                                    <h3>Name:</h3>  
                                    <p>{user.name}</p>  
                                    <h3>Email:</h3>  
                                    <p>{user.email}</p>  
                                </Col>  
                                <Col>  
                                    <h3>Date of Birth:</h3>  
                                    <p>{user.dob}</p>  
                                    <h3>Gender:</h3>  
                                    <p>{user.gender}</p>  
                                    <h3>Phone:</h3>  
                                    <p>{user.phone}</p>  
                                    <h3>Position:</h3>  
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