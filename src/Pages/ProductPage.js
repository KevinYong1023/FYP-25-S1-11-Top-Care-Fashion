import React, { useEffect, useState,useContext} from "react";
import { Container, Row, Col, Card, Button, Alert, OverlayTrigger, Tooltip, Form, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Components/CartContext";
import UserHeader from "../Components/Headers/userHeader";
import {AuthContext} from '../App';

const ProductPage = ({ email }) => {
  const { id } = useParams(); // Get product ID from route
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState("");
  const [comment, setComment] = useState("");
  const [productComments, setProductComments] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { login } = useContext(AuthContext ); 

  // Fetch user information
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (email) {
        try {
          const response = await fetch(`/api/user/${email}`);  // Assuming your API follows this route
          const data = await response.json();
          setUser(data.name);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    fetchUserDetails();
  }, [email]);

  // Fetch the product
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

  const fetchComments = async (product) => {
    if (product) {
      try {
        const res = await fetch(`/api/comments/latest/${product}`);
        const data = await res.json();
        setProductComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Unable to load comments.");
      }
    }
  };

  useEffect(() => {
    if (product) {
      fetchComments(product.title);
    }
  }, [product]);

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

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const requestBody = {
      description: comment,
      madeBy: user,
      product: product.title,
    };
    if (comment.trim()) {
      try {
        const res = await fetch(`/api/comments/${product.title}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        if (res.ok) {
          fetchComments(requestBody.product);
          setComment(""); // Reset comment field
        }
      } catch (err) {
        console.error("Error submitting comment:", err);
      }
    }
  };

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
                <h2 style={{ fontWeight: 'bold', color: '#6f4e37'}}>{product.title}</h2>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Description:</strong><br />{product.description}</p>
                <p><strong>Seller:</strong><br/>{product.seller}</p>
                {/* Add to Cart Button */}
                <OverlayTrigger
                  overlay={
                    email === product.email ? (
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
                      disabled={email === product.email || !login}
                      style={email === product.email ? { pointerEvents: "none" } : 
                      {backgroundColor: "#97a97c", borderColor: "#97a97c", color: "white"}}
                    >
                      Add to Cart
                    </Button>
                  </span>
                </OverlayTrigger>
              </Card>
            </Col>
      

        {/* Comments Section */}
        <div>
          <h3>Comments:</h3>
          {productComments.length > 0 ? (
            <ListGroup variant="flush">
              {productComments.map((comment) => (
                <ListGroup.Item key={comment.commentNo}>
                  <h5>{comment.description}</h5>
                  <p><strong>Made By:</strong> {comment.madeBy}</p>
                  <p><strong>Made At:</strong> {new Date(comment.created).toLocaleString()}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No comments yet. Be the first to leave a comment!</p>
          )}

          {/* Comment Form */}
          <Form onSubmit={handleSubmitComment} className="mt-4">
            <Form.Group controlId="formBasicComment">
              <Form.Label>Your Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </Form.Group>
            <Button 
            style={{ backgroundColor: "#6a4c37", borderColor: "#6a4c37", color: "white" }}
            type="submit" className="mt-2">Submit Comment</Button>
          </Form>
        </div>
        </Row>) : (
          <p>Loading product...</p>
        )}
      </Container> 
    </>
  );
};

export default ProductPage;
