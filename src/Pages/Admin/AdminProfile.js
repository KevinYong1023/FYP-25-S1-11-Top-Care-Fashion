import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import userData from '../../mockdata/users.json';
import userpic from '../../images/profile.png';
import AdminHeader from "../../Components/Headers/AdminHeader";
import AdminSideBar from "../../Components/Sidebars/AdminSidebar";

const AdminProfile = ({email}) => {
    const [user, setUser] = useState(null);
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

    return (
        <div>
            <AdminHeader/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        <AdminSideBar/>
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
                    </Col>
                </Row>
            </Container>
        </div>
           
    );
};

export default AdminProfile;
