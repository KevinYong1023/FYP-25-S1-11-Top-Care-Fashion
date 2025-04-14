import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UserHeader from "../Components/Headers/userHeader";

const UploadProduct = ({ email }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Top",
    imageUrl: ""
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

   // Fetch user details based on email
        useEffect(() => {
            const fetchUserDetails = async () => {
                if (email) {
                    try {
                        const response = await fetch(`/api/user/${email}`); 
                        const data = await response.json();
                        setName(data.name);
                    } catch (error) {
                        console.error('Error fetching user details:', error);
                    }
                }
            };
            fetchUserDetails();
        }, [email]);

  useEffect(() => {
    if (form.imageUrl.trim() !== "") {
      setPreviewUrl(form.imageUrl);
    } else {
      setPreviewUrl("");
    }
  }, [form.imageUrl]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // ✅ Frontend validation
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) {
      setError("Please enter a valid price greater than 0.");
      return;
    }

    if (!form.imageUrl.trim()) {
      setError("Image URL is required.");
      return;
    }

    // ✅ Relaxed URL validation: just checks if it's a proper URL
    const urlRegex = /^https?:\/\/.+/i;
    if (!urlRegex.test(form.imageUrl)) {
      setError("Please enter a valid public image URL (must start with http or https).");
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
      seller:name,
      email:email
    };

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // 👈 Add this line
      },
        body: JSON.stringify(productData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({
          title: "",
          description: "",
          price: "",
          category: "Top",
          imageUrl: ""
        });
        setPreviewUrl("");
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <>
      <UserHeader loginStatus={true} />
      <Container className="mt-4">
        <Card>
          <Card.Body>
            <Row>
              {/* Left: Image Preview */}
              <Col md={5} className="border-end text-center d-flex flex-column align-items-center justify-content-center">
                <h4>Image Preview</h4>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="img-thumbnail mt-2"
                    style={{ width: "300px", height: "300px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-muted mt-3">Enter an image URL to preview it here.</div>
                )}
              </Col>

              {/* Right: Product Form */}
              <Col md={7}>
                <h3 className="mb-3">Upload Product</h3>
                {success && <Alert variant="success">Product uploaded successfully!</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter product title"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Product description"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="Enter price"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                        >
                          <option value="Top">Top</option>
                          <option value="Bottom">Bottom</option>
                          <option value="Footwear">Footwear</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="Paste a public image URL"
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">Upload</Button>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default UploadProduct;
