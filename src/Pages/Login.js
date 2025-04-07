import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { setEmail, setRole, setLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    console.log("Login successful, token stored.");

                    setEmail(formData.email);
                    setLogin(true);

                    // Fetch user data from /me route to get the position
                    const meResponse = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${data.token}`
                        }
                    });

                    if (meResponse.ok) {
                        const meData = await meResponse.json();
                        setRole(meData.userData.position);

                        if (meData.userData.position === "user") {
                            navigate("/home");
                        } else if (meData.userData.position === "admin") {
                            navigate("/view-all-accounts");
                        } else if (meData.userData.position === "manager") {
                            navigate("/ManagerDashboard");
                        } else {
                            console.warn("Login successful but navigation for role not specified:", meData.userData.position);
                            navigate("/dashboard");
                        }
                    } else {
                        console.error("Failed to fetch user data from /me");
                        setError("Login successful, but failed to fetch user data.");
                    }
                } else {
                    console.error("Login successful but no token received from backend.");
                    setError("Login succeeded but failed to receive authentication token.");
                }
            } else {
                console.error("Login failed:", data.message);
                setError(data.message || "Login failed. Please check credentials");
            }
        } catch (error) {
            console.error("An error occurred during login fetch:", error);
            setError("An error occurred during login. Please try again.");
        }
    };

    return (
        <>
            <UserHeader loginStatus={false} />
            <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
                <h2 className="mb-4">Login to Your Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form className="w-50" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Login</Button>
                </Form>
                <p className="mt-3">Don't have an account? <a href="/register">Register here</a></p>
                <p className="mt-3">Forgot Password? <a href="/reset-password">Reset here</a></p>
            </Container>
        </>
    );
};

export default Login;