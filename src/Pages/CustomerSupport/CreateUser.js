import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../Components/Sidebar";
import AuthorityHeader from "../../Components/Headers/authrotiyHeaders";


const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    position: "",
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { id: users.length + 1, ...formData };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Account created successfully!");
  };

  return (
    <>
      <AuthorityHeader />
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs={12} md={2} id="sidebar" className="p-0" style={{ minHeight: "100vh" }}>
            <Sidebar />
          </Col>

          {/* Form Section - Pushed Up */}
          <Col md={10} className="d-flex justify-content-center align-items-start" style={{ minHeight: "100vh" }}>
            <div style={{ maxWidth: "400px", width: "100%", marginTop: "50px" }}>
              <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">
                <h4 className="text-center mb-4">Create Account</h4>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control className="mx-auto" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
                </Form.Group>
                <br></br>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control className="mx-auto" type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" />
                </Form.Group>
                <br></br>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control className="mx-auto" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>D.O.B</Form.Label>
                      <Form.Control className="mx-auto" type="text" name="dob" value={formData.dob} onChange={handleChange} placeholder="DD/MM/YYYY" />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control className="mx-auto" type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Male / Female" />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label>Phone No</Form.Label>
                  <Form.Control className="mx-auto" type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+65" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Position</Form.Label>
                  <Form.Control className="mx-auto" type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Enter position" />
                </Form.Group>

                <div className="text-center mt-3">
                  <Button type="submit">Create</Button>
                </div>


              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateAccount;
