import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button, Alert, OverlayTrigger, Tooltip, Form, ListGroup, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Components/CartContext";
import { AuthContext } from "../App";
import UserHeader from "../Components/Headers/userHeader";
import {AuthContext} from '../App';

const isLoggedIn = () => !!localStorage.getItem('authToken');

const ProductPage = () => {
    const { id: productId } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [user, setUser] = useState("");
    const [comment, setComment] = useState("");
    const [productComments, setProductComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user: authUser } = useContext(AuthContext);
    const loggedInUserId = authUser?._id;

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            setError("");
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token
                const apiUrl = `/api/products/${productId}`;
                console.log("Fetching product from:", apiUrl);
                const res = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include token in headers
                    }
                });
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to fetch product (Status: ${res.status})`);
                }
                const data = await res.json();
                if (!data || !data.userId) {
                    console.error("Fetched product data is missing userId:", data);
                    throw new Error("Product data loaded, but seller information is missing.");
                }
                setProduct(data);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(`Unable to load product details: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const fetchComments = async (productTitle) => {
        if (productTitle) {
            try {
                const res = await fetch(`/api/comments/latest/${productTitle}`);
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
        if (product && product.userId && product._id) {
            console.log("Attempting to add product to cart:", product);
            const itemToAdd = {
                id: product._id,
                productId: product._id,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
                sellerId: product.userId
            };
            console.log("Item object being passed to addToCart:", itemToAdd);
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
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const requestBody = {
            description: comment,
            madeBy: authUser,
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
                    setComment("");
                }
            } catch (err) {
                console.error("Error submitting comment:", err);
            }
        }
    };

    const isUserProduct = product && loggedInUserId && product.userId === loggedInUserId;

    return (
        <>
            <UserHeader loginStatus={isLoggedIn()} />
            <Container className="mt-4 product-page-container">
                {isLoading && (
                    <div className="text-center"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></div>
                )}
                {error && !isLoading && <Alert variant="danger">{error}</Alert>}
                {!isLoading && !error && product ? (
                    <Row>
                        <Col md={6} className="text-center mb-3 mb-md-0">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="img-fluid product-image"
                                style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "contain" }}
                                onError={(e) => { if (e.target.src !== 'https://via.placeholder.com/400') e.target.src = "https://via.placeholder.com/400"; }}
                            />
                        </Col>
                        <Col md={6}>
                            <Card className="p-4 product-details-card">
                                <h2>{product.title}</h2>
                                <p className="product-price"><strong>Price:</strong> ${product.price ? product.price.toFixed(2) : 'N/A'}</p>
                                <p><strong>Category:</strong> {product.category || 'N/A'}</p>
                                <p><strong>Description:</strong><br />{product.description || 'No description available.'}</p>
                                <div className="d-grid gap-2">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            isUserProduct ? (
                                                <Tooltip id="tooltip-disabled">
                                                    You cannot add your own product to the cart.
                                                </Tooltip>
                                            ) : (
                                                <></>
                                            )
                                        }
                                    >
                                        <span className="d-block">
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={handleAddToCart}
                                                disabled={isUserProduct || isLoading}
                                                style={isUserProduct ? { pointerEvents: "none" } : {}}
                                            >
                                                Add to Cart
                                            </Button>
                                        </span>
                                    </OverlayTrigger>
                                </div>
                            </Card>
                        </Col>
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
                                <Button variant="primary" type="submit" className="mt-2">Submit Comment</Button>
                            </Form>
                        </div>
                    </Row>
                ) : (
                    !isLoading && !error && <p>Product not found.</p>
                )}
            </Container>
        </>
    );
};

export default ProductPage;