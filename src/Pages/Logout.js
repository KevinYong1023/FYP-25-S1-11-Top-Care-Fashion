import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import UserHeader from '../Components/Headers/userHeader';
import { AuthContext } from "../App";  // Import context from App.js

export default function Logout() {  // Accept setIsLoggedIn as a prop
    const navigate = useNavigate();
    const { setLogin, setRole, setEmail,setName,setAddress,setUserEmail } = useContext(AuthContext);  // Use context to set email, login, and role
    
    useEffect(() => {
        resetStates();
    }, []);
    
    function resetStates(){
        localStorage.clear(); // this already clears everything
        setLogin(false);
        setRole("");
        setEmail("");
        setName("");       
        setAddress("");     
        setUserEmail("");  
    }

    const handleLogout = () => {
        resetStates() 
        navigate("/login");
    };

    const handleBackToHome = () => {
        resetStates() 
        navigate("/home");
    };
    

    return (
        <>
            <UserHeader loginStatus={false}/>
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <Row>
                    <Col className="text-center">
                        <h1>You have successfully logged out.</h1>
                        <br/>
                        <Button
                            style={{
                                backgroundColor: "#97a97c",
                                borderColor: "#97a97c",
                                color: "white",
                                fontSize:"20px"
                            }}
                            className="me-3"
                            onClick={handleLogout}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#85986c";
                                e.target.style.borderColor = "#85986c";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#97a97c";
                                e.target.style.borderColor = "#97a97c";
                            }}
                            >
                            Login
                        </Button>

                        <Button
                            style={{
                                backgroundColor: "#97a97c",
                                borderColor: "#97a97c",
                                color: "white",
                                fontSize:"20px"
                            }}
                            onClick={handleBackToHome}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#85986c";
                                e.target.style.borderColor = "#85986c";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#97a97c";
                                e.target.style.borderColor = "#97a97c";
                            }}
                            >
                            Back To Home
                        </Button>

                    </Col>
                </Row>
            </Container>
        </>
    );
}