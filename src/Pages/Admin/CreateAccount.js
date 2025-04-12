import React, { useState } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import AdminSidebar from "../../Components/Sidebars/AdminSidebar";
import AdminHeader from "../../Components/Headers/AdminHeader";
import "../../css/CreateAccount.css";

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
            formErrors.phone = 'Phone number must be 8 digits.';
        }
        if (!formData.password) formErrors.password = 'Password is required.';
        if (formData.password !== formData.confirmPassword)
            formErrors.confirmPassword = 'Passwords do not match.';
        if (formData.roles === "")
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
                confirmPassword: '',
                roles: ''
            });
            setError("");
            setErrors({});
        } else {
            setError("Please correct the errors before submitting.");
        }
    };

    return (
        <div>
            <AdminHeader />
            <Container fluid>
                <Row>
                    <Col xs={11} md={2} id="AdminSidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <AdminSidebar />
                    </Col>
                    <Col md={10} className="form-container">
                        <h2 className="create-account-header">Create an Account</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form className="account-form" onSubmit={handleSubmit}>
                            {["firstName", "lastName", "username", "email", "phone", "password", "confirmPassword", "roles"].map((field, index) => (
                                <Form.Group className="mb-3" key={index}>
                                    <Form.Label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Form.Label>
                                    <Form.Control
                                        type={field.toLowerCase().includes("password") ? "password" : "text"}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        placeholder={`Enter ${field}`}
                                    />
                                    {errors[field] && <Alert variant="danger">{errors[field]}</Alert>}
                                </Form.Group>
                            ))}
                            <div className="d-flex justify-content-end mt-3">
                                <Button type="submit" className="create-account-register">
                                    Register
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CreateAccount;
