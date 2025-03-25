import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Corrected API request URL to match the backend route
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // Handle the response (example)
        const data = await response.json();

        if (response.ok) {
          if (formData.role === "user") {
            navigate("/home");} 
            else if (formData.role === "admin"){
                navigate("/view-all-accounts");
            } 
            else if (formData.role === "manager"){
                navigate("/ManagerDashboard");
            }
            else {
                navigate("/dashboard")
        }
        } else {
            console.error("Login failed", data.message);
            alert(`Login failed: ${data.message}`);
            // Display error message to the user
        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        alert("An error occurred during login. Please try again.");
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
