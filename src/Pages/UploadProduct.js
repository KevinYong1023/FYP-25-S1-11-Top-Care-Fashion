import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
import { loadMobileNetModel } from "../Components/loadMobileNet";
import { occasionDataset } from "./OccassionDataset";
import "bootstrap/dist/css/bootstrap.min.css";
import UserHeader from "../Components/Headers/userHeader";
import { useNavigate } from 'react-router-dom';  

const categoryMap = {
  'shirt': 'Top',
  't-shirt': 'Top',
  'tank top': 'Top',
  'coat': 'Top',
  'poncho': 'Top',

  'pants': 'Bottom',
  'jean': 'Bottom',
  'shorts': 'Bottom',
  'trunks': 'Bottom',

  'shoe': 'Footwear',
  'sneaker': 'Footwear',
  'slipper': 'Footwear',
  'sandal': 'Footwear'
};

const UploadProduct = ({ email }) => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    occasion:"",
    image: null,
    imageUrl: ""
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0, sizeKB: 0 });
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (email) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/user/${email}`);
          const data = await response.json();
          setName(data.name);
          setUserId(data.userId);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }finally{
          setIsLoading(false)
        }
      }
    };
    fetchUserDetails();
  }, [email]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await loadMobileNetModel();
        setModel(loadedModel);
      } catch (error) {
        alert("Failed to load model, please try again.");
      }
    };
    loadModel();
  }, []);
  
  const resizeAndConvertToBase64 = (file, maxSize = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL("image/jpeg", quality);
          const approxSizeKB = Math.round((base64.length * 3) / 4 / 1024);

          setImageInfo({ width: Math.round(width), height: Math.round(height), sizeKB: approxSizeKB });
          resolve(base64);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const classifyImage = async (imageDataUrl) => {
    if (!imageDataUrl) return;
  
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageDataUrl;
      img.onload = async () => {
        try {
          const predictions = await model.classify(img);
  
          let detectedCategory = "Uncategorized";
          let detectedOccasion = "Unknown";
  
          //Object detection prediction 
          for (let prediction of predictions) {
            const className = prediction.className.toLowerCase();
  
            //Category detection
            for (const keyword in categoryMap) {
              if (className.includes(keyword)) {
                detectedCategory = categoryMap[keyword];
                break;
              }
            }
  
            //Occasion detection
            const classNames = className.split(",");
            for (const cls of classNames) {
              const trimmed = cls.trim();
              for (const keyword in occasionDataset) {
                if (trimmed.includes(keyword)) {
                  detectedOccasion = occasionDataset[keyword];
                  break;
                }
              }
              if (detectedOccasion !== "Unknown") break;
            }
          }
  
          if (detectedCategory === "Uncategorized") {
            alert("Image provided is not a suitable product, please upload another image");
          }
  
          resolve({ category: detectedCategory, occasion: detectedOccasion });
        } catch (error) {
          console.error("Error during classification:", error);
          reject("Error during classification");
        }
      };
  
      img.onerror = () => {
        console.error("Error loading the image.");
        reject("Error loading the image");
      };
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!model) {
      alert("Model is not loaded yet. Please re-upload the image.");
      return;
    }
  
    try {
      setIsLoading(true)
      const resizedBase64 = await resizeAndConvertToBase64(file);
      const { category, occasion } = await classifyImage(resizedBase64);
      
      setPreviewUrl(resizedBase64);
      setForm((prev) => ({
        ...prev,
        category,
        occasion,
        imageUrl: resizedBase64,
      }));
  
      console.log("Category:", category);
      console.log("Occasion:", occasion);
    } catch (err) {
      console.error("Image processing failed:", err);
      alert("There was a problem processing the image.");
    }finally{
      setIsLoading(false)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    console.log(form);
    if (!form.title || !form.price || !form.imageUrl || !form.category || !form.occasion) {
      setError("Please complete all fields including image upload.");
      return;
    }

    const productData = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      occasion: form.occasion,
      imageUrl: form.imageUrl,
      seller: name,
      email,
      userId
    };

    const token = localStorage.getItem("token");
    try {
      setIsLoading(true)
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        Authorization: `Bearer ${token}` // 👈 Add this line
      },
        body: JSON.stringify(productData)
      });

      const data = await res.json();
      console.log("DATA STARTS HERE")
      console.log(data.category);
      console.log(res)
      if (res.ok && form.category !== "Uncategorized") {
        setSuccess(true);
        setForm({ title: "", description: "", price: "", image: null, imageUrl: "", category: "" });
        setPreviewUrl("");
        setImageInfo({ width: 0, height: 0, sizeKB: 0 });
        navigate('/shoppage');
      } else {
        setError("Upload failed, please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <>
      <UserHeader loginStatus={true} />               
      <Container className="mt-4">
      {isLoading ?
        <div className="text-center mt-5">
                   <Spinner animation="border" role="status" variant="primary" />
                   <p className="mt-2">Loading...</p>
                 </div>
      :<>
        <Card>
          <Card.Body>
            <Row>
              <Col md={5} className="border-end text-center d-flex flex-column align-items-center justify-content-center">
                <h4 style={{ fontWeight: 'bold'}}>Image Preview</h4>
                {previewUrl ? (
                  <>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="img-thumbnail mt-2"
                    />
                    <div className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                      Dimensions: {imageInfo.width} × {imageInfo.height}px<br />
                      Estimated Size: {imageInfo.sizeKB} KB
                    </div>
                  </>
                ) : (
                  <div className="text-muted mt-3">No image selected.</div>
                )}
              </Col>

              <Col md={7}>
                <h3 className="mb-3 text-center" style={{ fontWeight: 'bold' , color: '#6f4e37'}}>Upload Product</h3>
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
                    <Col md={4}>
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
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          value={form.category}
                          readOnly
                          placeholder="Detected automatically"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                    <Form.Group className="mb-3">
                        <Form.Label>Occasion</Form.Label>
                        <Form.Control
                          type="text"
                          value={form.occasion}
                          readOnly
                          placeholder="Detected automatically"
                        />
                    </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    Upload
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        </>}
      </Container>
    </>
  );
};

export default UploadProduct;
