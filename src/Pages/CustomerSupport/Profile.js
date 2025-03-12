import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import userData from '../../mockdata/users.json';
import userpic from '../../images/profile.png';
import Sidebar from "../../Components/Sidebar";

const Profile = ({ email, setName }) => {
    const [user, setUser] = useState(null);

    useEffect(() =>{
        
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

    return (
        <>
         <Container fluid>
                     <Row className="d-flex">
                         {/* Sidebar - fixed width, no padding */}
                         <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                             <Sidebar />
                         </Col>
                          <Col style={{ margin: '10px' }}>
            <h2 className="my-4">Profile Page</h2>
            <Card className="p-4">
                <img src={userpic} alt="Profile" width="100" height="100" />
                <br/>
                <h4>Username: {user.username}</h4>
                <h4>Name: {user.name}</h4>
                <h4>Email: {user.email}</h4>
                <h4>Date of Birth: {user.dob}</h4>
                <h4>Gender: {user.gender}</h4>
                <h4>Phone: {user.phone}</h4>
                <h4>Position: {user.position}</h4>
                <br/>
            </Card></Col>
            </Row>
        </Container>
        </>
    );
};

export default Profile;
