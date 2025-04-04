// src/pages/ProductPage.js
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert, OverlayTrigger, Tooltip,Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Components/CartContext";
import UserHeader from "../Components/Headers/userHeader";

const ProductPage = ({ email }) => {
  const { id } = useParams(); // Get product ID from route
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComments] = useState("")
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product details.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
      });
      navigate("/cart");
    }
  };

  const isUserProduct = product && email === product.email;

  return (
    <>
      <UserHeader loginStatus={true} />
      <Container className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {product ? (
          <Row>
            {/* Left: Image */}
            <Col md={6} className="text-center">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="img-fluid"
                style={{ maxHeight: "500px", objectFit: "contain" }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/400")}
              />
            </Col>

            {/* Right: Info + Add to Cart */}
            <Col md={6}>
              <Card className="p-4">
                <h2>{product.title}</h2>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Description:</strong><br />{product.description}</p>

                {/* Add to Cart Button */}
                <OverlayTrigger
                  overlay={
                    isUserProduct ? (
                      <Tooltip id="tooltip-disabled">
                        Cannot add to cart as you posted this product
                      </Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <span className="d-inline-block">
                    <Button
                      variant="primary"
                      onClick={handleAddToCart}
                      disabled={isUserProduct}
                      style={isUserProduct ? { pointerEvents: "none" } : {}}
                    >
                      Add to Cart
                    </Button>
                  </span>
                </OverlayTrigger>
              </Card>
            </Col>
          </Row>
        ) : (
          <p>Loading product...</p>
        )}
        <div>
        <Form>  
                        <Form.Group controlId="formBasicComment">  
                            <Form.Label>Your Comment</Form.Label>  
                            <Form.Control  
                                as="textarea"  
                                rows={3}  
                                placeholder="Write your comment..."  
                                value={comment}  
                                onChange={(e) => setComments(comment)}  
                                required  
                            />  
                        </Form.Group>  
                        <Button variant="primary" type="submit">Submit Comment</Button>  
                    </Form>  
        </div>
      </Container>
    </>
  );
};

export default ProductPage;

