import React, { useEffect, useState,useContext} from "react";
import { Container, Row, Col, Card, Button, Alert, OverlayTrigger, Tooltip, Form, ListGroup,Spinner } from "react-bootstrap";
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
  const [isLoading, setIsLoading] = useState(false); 

  // Fetch user information
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (email) {
        try {
          setIsLoading(true)
          const response = await fetch(`/api/user/${email}`);  // Assuming your API follows this route
          const data = await response.json();
          setUser(data.name);
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError("Unable to load user details.");
        }finally{
          setIsLoading(false)
        }
      }
    };
    fetchUserDetails();
  }, [email]);

  // Fetch the product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Unable to load product details.");
      }finally{
        setIsLoading(false)
      }
    };
    fetchProduct();
  }, [id]);

  const fetchComments = async (product) => {
    if (product) {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/comments/latest/${product}`);
        const data = await res.json();
        setProductComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Unable to load comments.");
      }finally{
        setIsLoading(false)
      }
    }
  };

  useEffect(() => {
    if (product) {
      fetchComments(product.title);
    }
  }, [product]);

  const handleAddToCart = () => {
    if(!product.isOrdered){
    if (product && product.userId && product._id) {
        //console.log("Attempting to add product to cart:", product);
        const itemToAdd = {
            id: product._id,
            productId: product._id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            sellerId: product.userId,
            seller:product.seller
        };
        //console.log("Item object being passed to addToCart:", itemToAdd);
        try {
            addToCart(itemToAdd);
            alert(`${product.title} added to cart!`);
        } catch (cartError) {
            console.error("Error adding to cart:", cartError);
            alert(`Failed to add item to cart: ${cartError.message}`);
        }
    } else {
        console.error("Cannot add to cart: Product data or seller ID is missing.", product);
        alert("Cannot add this item to cart due to missing information.");
    }}else{
        setError("Order Sold, Please Select another one.");
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
        setIsLoading(true)
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
        setError("Error submitting comment:", err);
        console.error("Error submitting comment:", err);
      }finally{
        setIsLoading(false)
      }
    }else{
      setError("Please Don't Submit Empty Comment.");
    }
  };

  return (
    <>
      <UserHeader loginStatus={true} />
      <Container className="mt-4">
        {error && <Alert variant="danger">{error}</Alert>}

        { !isLoading && product ? (
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
                <p><strong>Occasion:</strong> {product.occasion}</p>
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
                      onClick={handleAddToCart}
                      disabled={email === product.email || !login || product.isOrdered}
                      style={email === product.email ? { pointerEvents: "none",  backgroundColor: "#97a97c",
                        borderColor: "#97a97c", } : {  backgroundColor: "#97a97c",
                        borderColor: "#97a97c",}}
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
                  <h3>{comment.description}</h3>
                  <p><strong>Made By:</strong> {comment.madeBy}</p>
                  <p><strong>Made At:</strong> {new Date(comment.created).toLocaleString()}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No comments yet. Be the first to leave a comment!</p>
          )}
          { user !== "" && (
            <>
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
              />
            </Form.Group>
            <Button style={{  backgroundColor: "#97a97c", borderColor: "#97a97c"}} type="submit"  className="mt-2">Submit Comment</Button>
          </Form></>)}
        </div>
        </Row>) : (
          <div className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-2">Loading...</p>
          </div>
        )}
      </Container> 
    </>
  );
};

export default ProductPage;