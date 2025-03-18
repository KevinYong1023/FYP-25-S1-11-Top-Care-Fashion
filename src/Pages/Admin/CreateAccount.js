import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../Components/Headers/userHeader";
import AdminSidebar from "../../Components/Sidebars/AdminSidebar";

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        roles: ''
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        let acceptedRoles = ["admin", "manager", "customer support"];

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
        } else if (!/^\d{8}$/.test(formData.phone)) {
            formErrors.phone = 'Phone number must be 10 digits.';
        }
        if (!formData.password) formErrors.password = 'Password is required.';

        if (formData.password !== formData.confirmPassword)
            formErrors.confirmPassword = 'Passwords do not match.';
        if(formData.roles === "")
            formErrors.roles = 'Choose a role';
        else if (!acceptedRoles.includes(formData.roles.toLowerCase())) 
            formErrors.roles = "Invalid role, choose another role";


        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const userInfo = `User Created:\nFirst Name: ${formData.firstName}
                                \nLast Name: ${formData.lastName}
                                \nUsername: ${formData.username}
                                \nEmail: ${formData.email}
                                \nPhone: ${formData.phone}
                                \nRole: ${formData.roles.toLowerCase()}\n`;
            
            // Create a Blob and trigger download
            const blob = new Blob([userInfo], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "created_user.txt";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            alert("User Created Successfully!");
            setFormData({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
        } else {
            setError("Please correct the errors before submitting.");
        }
    };

    return (

        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col xs={11} md={2} id="AdminSidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <AdminSidebar />
                </Col>

                {/* Create account Form */}
                <Col md={10} style={{ padding: '20px' }}>
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
                                placeholder="First name"
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
                                placeholder="Last name"
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
                                placeholder="Username"
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
                                placeholder="Phone number"
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
                        <Form.Group className="mb-3">
                            <Form.Label>Roles</Form.Label>
                            <Form.Control
                                type="text"
                                name="roles"
                                value={formData.roles}
                                onChange={handleChange}
                                placeholder="Choose a role"
                            />
                            {errors.roles && <Alert variant="danger">{errors.roles}</Alert>}
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">
                            Register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateAccount;
