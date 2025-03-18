import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import userData from '../../mockdata/users.json';
import userpic from '../../images/profile.png';
import Sidebar from "../../Components/Sidebars/Sidebar";
import AuthorityHeader from "../../Components/Headers/authrotiyHeaders";
import AdminSideBar from "../../Components/Sidebars/AdminSidebar";

const CustomerSupportProfile = ({ email, setName }) => {
    const [user, setUser] = useState(null);

    console.log(user)
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

    const roleBasedLayouts = {
        admin: {
            title: "Admin Profile",
            extraFields: <h4>Role: {user.position}</h4>
        },
        user: {
            title: "User Profile",
            extraFields: (
                <>
                </>
            )
        }
    };

    const getSidebar = () => {
        switch (user.position) {
            case "admin":
                return <AdminSideBar />;
            default:
                return <Sidebar />;
        }
    };

    // Get the correct layout based on user position
    const { title, extraFields } = roleBasedLayouts[user.position] || roleBasedLayouts.user;

    return (
        <div>
            <AuthorityHeader/>
            <Container fluid>
                <Row>
                    <Col xs={12} md={3} className="p-0">
                        {getSidebar()}
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
                            {extraFields}
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
        
    );
};

export default CustomerSupportProfile;
