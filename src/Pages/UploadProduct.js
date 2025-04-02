import React, { useState } from "react";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UserHeader from "../Components/Headers/userHeader";

const UploadProduct = ({ email }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Top",
    image: null // Change to store the file
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState(""); // For file size errors

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      // Validate file size (max 2MB)
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
        setFileError("File size exceeds 2MB.");
        return;
      }
      setFileError(""); // Clear the error if valid
      setForm({ ...form, [name]: file });

      // Preview Image
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result);
      };
      if (file) {
        fileReader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRemoveImage = () => {
    setForm({ ...form, image: null });
    setPreviewUrl("");
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
  
    if (!form.image) {
      setError("Image is required.");
      return;
    }
  
    // Convert image file to base64 string using FileReader
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result; // Base64-encoded image
  
      // Prepare product data including the base64 image
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        email: email,
        imageUrl: base64Image // Base64 image data to be sent to backend
      };
  
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // Set header for JSON
          body: JSON.stringify(productData) // Send product data as a JSON string
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setSuccess(true);
          setForm({
            title: "",
            description: "",
            price: "",
            category: "Top",
            image: null
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
    reader.readAsDataURL(form.image); // Start reading the image as base64 string
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
                  <div className="position-relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="img-thumbnail mt-2"
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-muted mt-3">No image selected.</div>
                )}
              </Col>

              {/* Right: Product Form */}
              <Col md={7}>
                <h3 className="mb-3">Upload Product</h3>
                {success && <Alert variant="success">Product uploaded successfully!</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                {fileError && <Alert variant="danger">{fileError}</Alert>}
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
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
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
