import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import userData from '../../mockdata/users.json';
import userpic from '../../images/profile.png';
import ManagerHeader from "../../Components/Headers/ManagerHeader";
import ManagerSideBar from "../../Components/Sidebars/ManagerSidebar";
import { useNavigate } from 'react-router-dom';  

const ManagerProfile = ({email}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() =>{
        
        let getEmail = localStorage.getItem("email");
        const fetchedUser = userData.find((user) => user.email === getEmail); 
        if (fetchedUser) {
            setUser(fetchedUser);
        }
    }, [email]);

    // Check if user data is loaded before rendering
    if (!user) {
        return <p>Loading user data...</p>;
    }

    function updateProfile(){
        navigate('/ManagerProfileUpdate');  
    }

    return (
        <div>
            <ManagerHeader/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        <ManagerSideBar/>
                    </Col>
                    <Col md={9} className="p-4">
                        <Card className={`p-4`}>
                            <img src={userpic} alt="Profile" width="120" height="120" />
                            <h4>Username: {user.name}</h4>
                            <h4>Name: {user.name}</h4>
                            <h4>Email: {user.email}</h4>
                            <h4>Date of Birth: {user.dob}</h4>
                            <h4>Gender: {user.gender}</h4>
                            <h4>Phone: {user.phone}</h4>
                        </Card>
                        <Button variant="primary" onClick={updateProfile}>Update Profile</Button>
                    </Col>
                </Row>
            </Container>
        </div>
           
    );
};

export default ManagerProfile;