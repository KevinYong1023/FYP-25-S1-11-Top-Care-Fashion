import React, { useState } from "react";
import { Form, Button, Alert, Row, Col,Spinner} from "react-bootstrap";
import AdminHeader from "../../Components/Headers/AdminHeader";
import { useNavigate } from "react-router-dom";

const AdminCreateAccount = () => {
    const [isLoading,setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        position: '',
        gender: '',
        dob: '' // Date of Birth field added
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
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (!formData.name) formErrors.name = ' Name is required.';
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
        if (!formData.password) {
            formErrors.password = 'Password is required.';
        } else if (!passwordRegex.test(formData.password)) {
            formErrors.password = 'Password must be at least 8 characters and include at least one symbol.';
        }
        if (formData.password !== formData.confirmPassword)
            formErrors.confirmPassword = 'Passwords do not match.';
        if (!formData.position) formErrors.position = 'Position is required.';
        if (!formData.gender) formErrors.gender = 'Gender is required.';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const backtoDashboard= () =>{
        navigate("/view-all-accounts");
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true)
                const response = await fetch("/api/mainregister", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        phone: formData.phone,
                        position: formData.position,
                        gender: formData.gender,
                        dob: formData.dob
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    backtoDashboard()
                } else {
                    setError(data.message || "Registration failed. Please try again.");
                }
            } catch (error) {
                setError("Server error. Please Try Agin.");
            }finally{
                setIsLoading(false)
            }
        } else {
            setError("Please correct the errors before submitting.");
        }
    };
    return (
      <>
        <AdminHeader />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Main content */}
          <div style={{ flex: 1, padding: '40px', backgroundColor: '#f0efeb' }}>
            {isLoading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '30px',
                }}
              >
                <Button onClick={backtoDashboard} className="mb-3" style={{backgroundColor: '#6b705c'}}>
                  Back
                </Button>
                <hr/>
                <h2 className="mb-4" style={{ color: '#6f4e37'}}>Create an Account</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  {/* Username */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: 'bold'}}>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                    {errors.username && <Alert variant="danger">{errors.username}</Alert>}
                  </Form.Group>
    
                  {/* Name */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: 'bold'}}>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                    />
                    {errors.name && <Alert variant="danger">{errors.name}</Alert>}
                  </Form.Group>
    
                  {/* Email */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: 'bold'}}>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                    {errors.email && <Alert variant="danger">{errors.email}</Alert>}
                  </Form.Group>
    
                  {/* Phone */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: 'bold'}}>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && <Alert variant="danger">{errors.phone}</Alert>}
                  </Form.Group>
    
                  {/* 3 Columns: Position, DOB, Gender */}
                  <div className="d-flex gap-3 mb-3">
                    {/* Position */}
                    <div style={{ flex: 1 }}>
                      <Form.Label style={{fontWeight: 'bold'}}>Position</Form.Label>
                      <Form.Select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                      >
                        <option value="">Select position</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="customer support">Customer Support</option>
                      </Form.Select>
                      {errors.position && <Alert variant="danger">{errors.position}</Alert>}
                    </div>
    
                    {/* DOB */}
                    <div style={{ flex: 1 }}>
                      <Form.Label style={{fontWeight: 'bold'}}>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                      {errors.dob && <Alert variant="danger">{errors.dob}</Alert>}
                    </div>
    
                    {/* Gender */}
                    <div style={{ flex: 1 }}>
                      <Form.Label style={{fontWeight: 'bold'}}>Gender</Form.Label>
                      <div className="d-flex align-items-center gap-2">
                        <Form.Check
                          type="radio"
                          label="Male"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={handleChange}
                        />
                        <Form.Check
                          type="radio"
                          label="Female"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.gender && <Alert variant="danger">{errors.gender}</Alert>}
                    </div>
                  </div>
    
                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: 'bold'}}>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                    />
                    {errors.password && <Alert variant="danger">{errors.password}</Alert>}
                  </Form.Group>
    
                  {/* Confirm Password */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{fontWeight: 'bold'}}>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                    />
                    {errors.confirmPassword && (
                      <Alert variant="danger">{errors.confirmPassword}</Alert>
                    )}
                  </Form.Group>
    
                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      className="w-100"
                      style={{
                        backgroundColor: '#6b705c',
                        borderColor: '#6b705c',
                        fontSize: '20px',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      Register
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </div>
      </>
    );
    
};

export default AdminCreateAccount;
