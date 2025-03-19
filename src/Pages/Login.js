import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";  // Import context from App.js
import UserHeader from "../Components/Headers/userHeader";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "", role: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { setLogin, setRole, setEmail } = useContext(AuthContext);  // Use context to set email, login, and role

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
        setLogin(true);
        setEmail(formData.email);

        // Save data to localStorage
        localStorage.setItem("role", formData.role);
        localStorage.setItem("email", formData.email);
        console.log(formData.role )
        // Navigate based on the role
        if (formData.role === "user") {
            navigate("/shoppage");} 
            else if (formData.role === "admin"){
                navigate("/view-all-accounts");
            } 
            else if (formData.role === "manager"){
                navigate("/ManagerDashboard");
            }
            else {
                navigate("/dashboard")
        }
    };
    return (
        <>
        <UserHeader loginStatus={false}/>
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
                    <Form.Group>
    <div>
        <Form.Check 
            type="radio" 
            label="User" 
            name="role" 
            value="user" 
            onChange={handleChange} 
            required
            checked={formData.role === "user"} 
        />
        <br/>
        <Form.Check 
            type="radio" 
            label="Admin" 
            name="role" 
            value="admin" 
            onChange={handleChange} 
            required
            checked={formData.role === "admin"} 
        /><br/>
        <Form.Check 
            type="radio" 
            label="Customer Support" 
            name="role" 
            value="customer support" 
            onChange={handleChange} 
            required
            checked={formData.role === "customer support"} 
        /><br/>
        <Form.Check 
            type="radio" 
            label="Manager" 
            name="role" 
            value="manager" 
            onChange={handleChange} 
            required
            checked={formData.role === "manager"} 
        />
    </div>
</Form.Group>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">Login</Button>
            </Form>
            <p className="mt-3">Don't have an account? <a href="/register">Register here</a></p>
        </Container>
        </>
    );
};


export default Login;  