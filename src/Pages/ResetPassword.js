import React, { useState, useContext } from "react";
import { Container, Form, Button, Alert,Row } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email"){
        setEmail(value);
    }else if (name === "newPassword"){
        setNewPassword(value);
    }else if (name === "confirmPassword"){
        setConfirmPassword(value);
    }
  };

  const validateForm = () => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!email) {
      setError("Please enter your email.");
      return true;
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return true;
    } else if (!passwordRegex.test(newPassword)) {
      setError("Password must be at least 8 characters and include at least one symbol.");
      return true;
    }

    setError(null);
    return false;
  };

  
  function backToLogin(){
    navigate("/login")
  }

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()){
     try {
      const response = await fetch(`/api/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Password reset successfully!");
        backToLogin()
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    }
    }
  };

  return (
    <>
      <UserHeader loginStatus={false} />
      <Container className="d-flex flex-column justify-content-center align-items-center" style={{ marginTop: "200px", marginBottom: "80px" }}>
        <h2 className="mb-4" style={{ color: '#6f4e37', fontWeight:'bold'}}>Reset Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form className="w-50" onSubmit={handleResetPassword}>
          <Form.Group className="mb-3">
            <Form.Label style={{fontWeight:'bold'}}>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{fontWeight:'bold'}}>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              value={newPassword}
              placeholder="Enter new password"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{fontWeight:'bold'}}>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              placeholder="Enter new password again"
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Row>
          <div className="d-flex flex-column gap-3">
          <Button
            style={{ backgroundColor: "#97a97c", borderColor: "#97a97c", color: "white" }}
            className="w-100"
            type="submit"
          >
            Reset Password
          </Button>

          <Button
            style={{ backgroundColor: "#6b705c", borderColor: "#6b705c", color: "white" }}
            className="w-100"
            onClick={backToLogin}
          >
            Back to Login
          </Button>

          </div>

          </Row>
         
        </Form>
      </Container>
    </>
  );
}
