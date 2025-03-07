import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
 
const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let formErrors = {};

        if (!formData.firstName) formErrors.firstName = 'First Name is required.';
        if (!formData.lastName) formErrors.lastName = 'Last Name is required.';
        if (!formData.username) formErrors.username = 'Username is required.';
        if (!formData.email) {
            formErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Email is invalid.';
        }
        if (!formData.phone) {
            formErrors.phone = 'Phone number is required.';
        } else if (!/^\d{10}$/.test(formData.phone)) {
            formErrors.phone = 'Phone number must be 10 digits.';
        }
        if (!formData.password) formErrors.password = 'Password is required.';
        if (formData.password !== formData.confirmPassword)
            formErrors.confirmPassword = 'Passwords do not match.';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            alert("Registration Successful!");
            navigate("/login"); // Redirect to login page
        } else {
            setError("Please correct the errors before submitting.");
        }
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h2 className="mb-4">Create an Account</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form className="w-50" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                    />
                    {errors.firstName && <Alert variant="danger">{errors.firstName}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                    />
                    {errors.lastName && <Alert variant="danger">{errors.lastName}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                    />
                    {errors.username && <Alert variant="danger">{errors.username}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                    {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && <Alert variant="danger">{errors.phone}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                    />
                    {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <Alert variant="danger">{errors.confirmPassword}</Alert>}
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Register
                </Button>
            </Form>
            <p className="mt-3">
                Already have an account? <a href="/login">Login here</a>
            </p>
        </Container>
    );
};

export default Register;
