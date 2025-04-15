import React, { useState, useContext, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { setEmail, setRole, setLogin, setName, setAddress } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(()=>{
    localStorage.clear(); // this already clears everything
  },[])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const loginRole = data.user.role;
        setEmail(formData.email);
        setRole(loginRole);
        setLogin(true);
        setAddress(data.user.address);
        setName(data.user.name);

        if (loginRole === "user") navigate("/home");
        else if (loginRole === "admin") navigate("/view-all-accounts");
        else if (loginRole === "manager") navigate("/ManagerDashboard");
        else navigate("/dashboard");
      } else {
        console.error("Login failed", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <>
      <UserHeader loginStatus={false} />
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h2 className="mb-4" style={{ fontFamily: 'Math', color: '#6f4e37' }}>
          Login to Your Account
        </h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form className="w-50" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            style={{
              backgroundColor: "#97a97c",
              borderColor: "#97a97c",
              color: "white",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#85986c";
              e.target.style.borderColor = "#85986c";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#97a97c";
              e.target.style.borderColor = "#97a97c";
            }}
          >
            Login
          </Button>
        </Form>
        <p className="mt-3">
          Don't have an account? <a href="/register">Register here</a>
        </p>
        <p className="mt-3">
          Forgot Password? <a href="/reset-password">Reset here</a>
        </p>
      </Container>
    </>
  );
};

export default Login;
