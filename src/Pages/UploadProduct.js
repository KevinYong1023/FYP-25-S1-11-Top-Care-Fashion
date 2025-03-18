import React, { useState, useCallback } from "react";
import { useEffect } from "react";
import Cropper from "react-easy-crop";
import { Container, Form, Button, Card, Row, Col, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UserHeader from "../Components/Headers/userHeader";

let categoryName = ""

const UploadProduct = () => {
    const [product, setProduct] = useState({
        title: "",
        brand: "",
        condition: "",
        size: "",
        price: "",
        category: categoryName, 
        description: "",
        images: [],
    });

    // Use states for updating the page
    const [preview, setPreview] = useState([]);
    const [cropModal, setCropModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [category, setCategory] = useState(categoryName);

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    useEffect(() => {
        console.log("Updated Category:", product.category);
    }, [product.category]); 

    // Open cropping modal
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const fileURL = URL.createObjectURL(files[0]);
            setSelectedImage(fileURL);
            setCropModal(true);
    
            // Update product state using a function to get the latest state
            setProduct(prev => {
                if (prev.images.length === 0) { 
                    const detectedCategory = handleCategory(files[0]);
                    return { ...prev, category: detectedCategory };
                }
                return prev; 
            });
        }
    };

    const handleCategory = (file) => {
        const fileName = file.name.toLowerCase();
        if (fileName.includes("shirt") || fileName.includes("hoodie")) {
            categoryName = "Top";
            setCategory(categoryName);
            return "Top";
        } else if (fileName.includes("jeans") || fileName.includes("pants") || fileName.includes("shorts")) {
            categoryName = "Bottom";
            setCategory(categoryName);
            return "Bottom";
        } else if (fileName.includes("shoe") || fileName.includes("sneaker")) {
            categoryName = "Footware";
            setCategory(categoryName);
            return "FootWear";
        }
        setCategory(categoryName);
        return "Invalid Item"; // Default: No category assigned
    }
    // Handle cropping change
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        console.log(croppedArea, croppedAreaPixels);
    }, []);

    // Save cropped image
    const saveCroppedImage = () => {
        setPreview([...preview, selectedImage]); // Add cropped image to preview
        setProduct((prev) => ({
            ...prev,
            images: [...prev.images, selectedImage],
        }));
        setCropModal(false);
    };

    // Remove selected image
    const handleRemoveImage = (index) => {
        setProduct((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setPreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(product.category === "Invalid Item"){
            alert("Please select another image");
            return;
        }

        if (!product.title || !product.brand || !product.condition || !product.size || !product.price || !product.category || !product.description || product.images.length === 0) {
            alert("Please fill all fields and upload images.");
            return;
        }
            alert("Product details have been saved!");
        
            setProduct({ title: "", brand: "", condition: "", size: "", price: "", category: "", description: "", images: [] });
            setPreview([]);    
    };

    return (
        <>
        <UserHeader  loginStatus={true}/>
       
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Row>
                        {/* Left Side: Image Previews */}
                        <Col md={5} className="border-end d-flex flex-column align-items-center">
                            <h3 className="mb-3">Image Previews</h3>
                            <div className="w-100 text-center">
                                {preview.length > 0 ? (
                                    <>
                                        <div className="position-relative">
                                            <img
                                                src={preview[0]}
                                                alt="Main Preview"
                                                className="img-thumbnail mb-2"
                                                style={{ width: "400px", height: "400px", objectFit: "cover" }}
                                            />
                                            <Button
                                                variant="light"
                                                size="sm"
                                                className="position-absolute top-0 end-0 p-1 rounded-circle border border-secondary"
                                                style={{ width: "20px", height: "20px", fontSize: "12px", lineHeight: "1" }}
                                                onClick={() => handleRemoveImage(0)}
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        <div className="d-flex flex-wrap justify-content-center">
                                            {preview.slice(1).map((url, index) => (
                                                <div key={index + 1} className="position-relative m-1">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 2}`}
                                                        className="img-thumbnail"
                                                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                    />
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        className="position-absolute top-0 end-0 p-1 rounded-circle border border-secondary"
                                                        style={{ width: "20px", height: "20px", fontSize: "12px", lineHeight: "1" }}
                                                        onClick={() => handleRemoveImage(index + 1)}
                                                    >
                                                        ×
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                    <p className="text-muted">No images uploaded yet. </p>
                                    <p className="text-muted">Please upload an image with frontal view of the product for best results</p>
                                    </div>
                                )}
                            </div>
                        </Col>

                        {/* Right Side: Product Form */}
                        <Col md={7}>
                            <h3 className="mb-3">Upload a New Product</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Listing Title</Form.Label>
                                    <Form.Control type="text" name="title" value={product.title} onChange={handleChange} placeholder="Enter listing title" required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control type="text" name="brand" value={product.brand} onChange={handleChange} placeholder="Enter brand" required />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Condition</Form.Label>
                                        <Form.Select name="condition" value={product.condition} onChange={handleChange} required>
                                                <option value="">Select condition</option>
                                                <option value="New">New</option>
                                                <option value="Like New">Like New</option>
                                                <option value="Used">Used</option>
                                                <option value="For Parts">For Parts</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Size</Form.Label>
                                            <Form.Select name="size" value={product.size} onChange={handleChange} required>
                                                <option value="">Select Size</option> 
                                                <option value="XS">XS</option>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price ($)</Form.Label>
                                            <Form.Control type="number" name="price" value={product.price} onChange={handleChange} placeholder="Enter product price" required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control type="test" placeholder="Category" disabled value={product.category} onChange={handleCategory}></Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" name="description" rows={4} value={product.description} onChange={handleChange} placeholder="Enter product description" required />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Upload Images</Form.Label>
                                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} multiple required />
                                </Form.Group>

                                <Button variant="primary" type="submit">Post</Button>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Crop Image Modal */}
            <Modal show={cropModal} onHide={() => setCropModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Adjust Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedImage && (
                        <div style={{ position: "relative", width: "100%", height: "400px" }}>
                            <Cropper
                                image={selectedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setCropModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={saveCroppedImage}>Save</Button>
                </Modal.Footer>
            </Modal>
        </Container>
        </>
    );
};

export default UploadProduct;
