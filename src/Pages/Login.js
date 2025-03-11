import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";  // Import context from App.js

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "", role: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { setIsLoggedIn, setRole, setEmail } = useContext(AuthContext);  // Use context to set email, login, and role

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.role) {
            setError("All fields are required!");
            return;
        }

        setError("");
        alert("Login Successful!");

        // Save data in context
        setRole(formData.role);
        setIsLoggedIn(true);
        setEmail(formData.email);

        // Save data to localStorage
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", formData.role);
        localStorage.setItem("email", formData.email);

        // Navigate based on the role
        if (formData.role === "user") {
            navigate("/shoppage");
        } else {
            navigate("/dashboard");
        }
    };
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h2 className="mb-4">Login to Your Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="w-50" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Login As:</Form.Label>
                    <Form.Control type="text" name="role" placeholder="Enter your role" onChange={handleChange} required />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">Login</Button>
            </Form>
            <p className="mt-3">Don't have an account? <a href="/register">Register here</a></p>
        </Container>
    );
};

export default Login;
