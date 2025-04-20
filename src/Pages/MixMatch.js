import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import UserHeader from '../Components/Headers/userHeader';
import { Container, Row, Col, Form, Button, Spinner, Card } from "react-bootstrap";
import { occasionDataset } from './OccassionDataset';

const MixMatch = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [occasion, setOccasion] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [form, setForm] = useState({ occasion: "" });
  const [outfit, setOutfit] = useState([])

  useEffect(() => {
    const loadModel = async () => {
      setLoading(true);
      await tf.ready();
      const loadedModel = await mobilenet.load();
      if(loadedModel){
        setLoading(false);
        setModel(loadedModel);
        console.log("Model loaded");
      }else{
       console.error("Model Error, Refresh page to try again")
      }
    };
    loadModel();
  }, []);

  const handleImageUpload = async (event) => {
    setOutfit([])
    setForm({occasion:""})
    setOccasion("")
    const file = event.target.files[0];
    if (!file || !model) {
      alert("Please wait for the model to load before uploading an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const imageSrc = reader.result;
      setImageUrl(imageSrc);
      setLoading(true);

      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = "anonymous";

      image.onload = async () => {
        const predictions = await model.classify(image);
        console.log("Predictions:", predictions);

        let detectedOccasion = "Unknown";
        for (const prediction of predictions) {
          const classNames = prediction.className.toLowerCase().split(",");
          for (const className of classNames) {
            const trimmed = className.trim();
            for (const keyword in occasionDataset) {
              if (trimmed.includes(keyword)) {
                detectedOccasion = occasionDataset[keyword];
                break;
              }
            }
            if (detectedOccasion !== "Unknown") break;
          }
          if (detectedOccasion !== "Unknown") break;
        }

        setOccasion(detectedOccasion);
        setLoading(false);
      };
    };
    reader.readAsDataURL(file);
  };


  const handleMixMatch = async (e) => {
    e.preventDefault();
    setOutfit([])
    const finalOccasion = occasion || form.occasion;
    if (finalOccasion) {
      try {
        setLoading(true);
        const response = await fetch(`/api/products`);
        const data = await response.json();
  
             // Filter products by occasion
      const filtered = data.filter(product => product.occasion === finalOccasion);

      // Helper to get a random item from a specific category
      const getRandomItem = (items, category) => {
        const categoryItems = items.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * categoryItems.length);
        return categoryItems[randomIndex];
      };

      // Randomly pick one from each category
      const top = getRandomItem(filtered, "Top");
      const bottom = getRandomItem(filtered, "Bottom");
      const footwear = getRandomItem(filtered, "Footwear");

      // Set the outfit
      setOutfit([top, bottom, footwear].filter(Boolean)); // remove nulls
      } catch (error) {
        console.error("Something went wrong, please try again", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <>
      <UserHeader loginStatus={true} />
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <Container fluid className="p-4" style={{ minHeight: "90vh" }}>
          <Row>
            {/* LEFT SIDE: Inputs */}
            <Col md={5} className="border-end pe-4">
              <Form onSubmit={handleMixMatch}>
                <Form.Group className="mb-3">
                  <h4><strong>Upload Clothing Item Picture</strong></h4>
                  <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                </Form.Group>
  
                <div className="mb-3">
                  <h5><strong>Detected Occasion:</strong> {occasion || "None"}</h5>
                  <div className="mb-4">
                <h5><strong>Image Preview</strong></h5>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="img-thumbnail mt-2"
                    width={"450px"} height={"450px"}
                  />
                ) : (
                  <div className="text-muted mt-3">No image selected.</div>
                )}
              </div>
  
                  <Button type="submit" variant="primary">Mix & Match</Button>
                </div>
              </Form>
  
              <div className="mt-4">
                <p><strong>Incorrect? Choose the occasion manually:</strong></p>
                <Form.Group className="mb-3">
                  <Form.Label>Occasion</Form.Label>
                  <Form.Select
                    value={form.occasion}
                    onChange={(e) =>{ 
                        setImageUrl(null)
                        setForm({ ...form, occasion: e.target.value })
                        setOutfit([])
                    }}
                  >
                    <option value="">Select occasion</option>
                    <option value="Casual">Casual</option>
                    <option value="Smart">Smart</option>
                    <option value="Formal">Formal</option>
                    <option value="Sport">Sport</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </Col>
  
            {/* RIGHT SIDE: Preview + Outfit */}
            <Col md={7} className="ps-4">
              <div>
              <h4><strong>Suggested Outfit</strong></h4>
  {outfit.length > 0 ? (
    <div className="d-flex flex-column gap-4">
      {outfit.map((item, index) => (
        <Card key={index} className="p-3 shadow-sm">
          <Row className="align-items-center">
            {/* Left: Image */}
            <Col md={4} lg={3}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="img-fluid rounded"
            
              />
            </Col>

            {/* Right: Details */}
            <Col md={8} lg={9}>
              <h5>{item.title}</h5>
              <p className="mb-1"><strong>Category:</strong> {item.category}</p>
              <p className="mb-1"><strong>Price:</strong> ${item.price}</p>
             <Button style={{ backgroundColor: '#6f4e37', borderColor: '#6f4e37'}} href={`/productpage/${item._id}`}>
                                   View Product
                </Button>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  ) : (
    <div className="text-muted">No matching outfit found for this occasion.</div>
  )}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
  
};

export default MixMatch;