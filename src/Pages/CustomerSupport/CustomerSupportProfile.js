import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import userData from '../../mockdata/users.json';
import userpic from '../../images/profile.png';
import Sidebar from "../../Components/Sidebar";
import AuthorityHeader from "../../Components/Headers/authrotiyHeaders";
import AdminSideBar from "../../Components/AdminSidebar";

const CustomerSupportProfile = ({ email, setName }) => {
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
//export default Profile;

// return (
//     <>
//     <AuthorityHeader/>
//      <Container fluid>
//                  <Row className="d-flex">
//                      {/* Sidebar - fixed width, no padding */}
//                      <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
//                          <Sidebar />
//                      </Col>
//                       <Col style={{ margin: '10px' }}>
//         <h2 className="my-4">Profile Page</h2>
//         <Card className="p-4">
//             <img src={userpic} alt="Profile" width="100" height="100" />
//             <br/>
//             <h4>Username: {user.username}</h4>
//             <h4>Name: {user.name}</h4>
//             <h4>Email: {user.email}</h4>
//             <h4>Date of Birth: {user.dob}</h4>
//             <h4>Gender: {user.gender}</h4>
//             <h4>Phone: {user.phone}</h4>
//             <h4>Position: {user.position}</h4>
//             <br/>
//         </Card></Col>
//         </Row>
//     </Container>
// );



//     return (
//         <>
//          <Container fluid>
//                      <Row className="d-flex">
//                          {/* Sidebar - fixed width, no padding */}
//                          <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
//                              <Sidebar />
//                          </Col>
//                           <Col style={{ margin: '10px' }}>
//             <h2 className="my-4">Profile Page</h2>
//             <Card className="p-4">
//                 <img src={userpic} alt="Profile" width="100" height="100" />
//                 <br/>
//                 <h4>Username: {user.username}</h4>
//                 <h4>Name: {user.name}</h4>
//                 <h4>Email: {user.email}</h4>
//                 <h4>Date of Birth: {user.dob}</h4>
//                 <h4>Gender: {user.gender}</h4>
//                 <h4>Phone: {user.phone}</h4>
//                 <h4>Position: {user.position}</h4>
//                 <br/>
//             </Card></Col>
//             </Row>
//         </Container>
//         </>
//     );
// };

export default CustomerSupportProfile;
