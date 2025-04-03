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
      // Corrected API request URL to match the backend route
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

      const data = await response.json(); // Get the response data (contains token or error message)

      if (response.ok) {
        // --- EDIT: Retrieve and Store Token ---
        if (data.token) {
          localStorage.setItem('authToken', data.token); // Store token!
          console.log("Login successful, token stored.");

          // --- Now update context and navigate ---
          setEmail(formData.email); // Update context with email
          setRole(formData.role);   // Update context with role
          setLogin(true);         // Update context login status

          // Navigate based on role
          if (formData.role === "user") {
            navigate("/home"); // Or maybe '/payment'?
          } else if (formData.role === "admin") {
            navigate("/view-all-accounts");
          } else if (formData.role === "manager") {
            navigate("/ManagerDashboard");
          } else {
            // Fallback navigation if needed, or handle unknown roles
             console.warn("Login successful but navigation for role not specified:", formData.role);
             navigate("/dashboard"); // Example fallback
          }

        } else {
           // This case should ideally not happen if backend sends token on success
           console.error("Login successful but no token received from backend.");
           setError("Login succeeded but failed to receive authentication token.");
        }
        // --- END EDIT ---

      } else {
        // Handle login failure from backend response
        console.error("Login failed:", data.message);
        // --- EDIT: Use setError state instead of alert ---
        setError(data.message || "Login failed. Please check credentials");
        // --- END EDIT ---
      }
    } catch (error) {
      console.error("An error occurred during login fetch:", error);
      // --- EDIT: Use setError state instead of alert ---
      setError("An error occurred during login. Please try again.");
      // --- END EDIT ---
    } finally {
        // Consider adding setIsLoading(false) here if using loading state

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
