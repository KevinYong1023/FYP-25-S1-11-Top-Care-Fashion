import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


const Home = () => {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <h1 className="mb-4">Welcome to <span className="text-primary">Top Care Fashion</span></h1>
            <p className="lead">Discover the latest trends in fashion with us!</p>
            
            <div className="mt-4">
                <Link to="/register">
                    <Button variant="primary" className="me-3">Register</Button>
                </Link>
                <Link to="/login">
                    <Button variant="outline-primary">Login</Button>
                </Link>
            </div>
        </Container>
    );
};

export default Home;
