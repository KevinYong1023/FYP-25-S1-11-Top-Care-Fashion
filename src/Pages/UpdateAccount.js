import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserHeader from '../Components/Headers/userHeader';
const UpdateAccount = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
    });

    const navigate = useNavigate();

    console.log("UpdateAccount Component Rendered"); // Debugging check

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Account details saved successfully!");
        navigate("/user-profile");
    };

    return (
        <>
        <UserHeader  loginStatus={true}/>
  
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h2 className="mb-4">Update Account</h2>

            <Form className="w-50" onSubmit={handleSubmit}>
                {/* First Name */}
                <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                    />
                </Form.Group>

                {/* Last Name */}
                <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                    />
                </Form.Group>

                {/* Username */}
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                    />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </Form.Group>

                {/* Phone Number */}
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                    />
                </Form.Group>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate("/user-profile")}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                </div>
            </Form>

        </Container>
        </>
    );
};

export default UpdateAccount;
