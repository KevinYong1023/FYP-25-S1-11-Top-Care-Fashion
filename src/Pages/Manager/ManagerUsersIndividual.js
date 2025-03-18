// Pages/ManagerUsersIndividual.js
import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersIndividual() {
    const { id } = useParams(); // Get user ID from URL parameters

    // Mock User Data
    const userData = {
        id: "USR001",
        username: "john_doe",
    };

    // Mock Product Posts Data
    const [productPosts, setProductPosts] = useState([
        { postId: "P001", name: "Sneakers", price: "$50", description: "Brand new sneakers", datePosted: "02/03/2023" },
        { postId: "P002", name: "Denim Jacket", price: "$40", description: "Lightly used denim jacket", datePosted: "15/05/2023" },
        { postId: "P003", name: "Wrist Watch", price: "$70", description: "Classic leather strap watch", datePosted: "22/07/2023" },
        { postId: "P004", name: "Backpack", price: "$30", description: "Spacious travel backpack", datePosted: "10/09/2023" },
    ]);

    // Mock Review Data
    const [reviews, setReviews] = useState([
        { reviewId: "R001", postId: "P005", id: "USR001", date: "05/03/2023", comment: "Great quality!", rating: "5/5" },
        { reviewId: "R002", postId: "P006", id: "USR001", date: "18/05/2023", comment: "Very comfortable.", rating: "4/5" },
        { reviewId: "R003", postId: "P007", id: "USR001", date: "25/07/2023", comment: "Looks stylish!", rating: "5/5" },
    ]);

    // Delete product post
    const handleDeletePost = (postId) => {
        setProductPosts(productPosts.filter(post => post.postId !== postId));
        alert("Post deleted");
    };

    // Delete review
    const handleDeleteReview = (reviewId) => {
        setReviews(reviews.filter(review => review.reviewId !== reviewId));
        alert("Review deleted");
    };

    return (
        <Container fluid>
            <ManagerHeader />
            <Row>
                {/* Sidebar */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: "100vh" }}>
                    <ManagerSidebar />
                </Col>

                {/* Main Content */}
                <Col md={9} lg={10} className="px-md-4">
                    <h2 className="mt-3">User: {userData.username} (ID: {userData.id})</h2>

                    {/* Product Posting History */}
                    <Card className="p-3 my-4">
                        <h3>Product Posting History</h3>
                        <Table striped bordered hover className="mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Post ID</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Date Posted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productPosts.map((post) => (
                                    <tr key={post.postId}>
                                        <td>{post.postId}</td>
                                        <td>{post.name}</td>
                                        <td>{post.price}</td>
                                        <td>{post.description}</td>
                                        <td>{post.datePosted}</td>
                                        <td>
                                            <Button variant="danger" size="sm" onClick={() => handleDeletePost(post.postId)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>

                    {/* Review/Comment History */}
                    <Card className="p-3 my-4">
                        <h3>Review History</h3>
                        <Table striped bordered hover className="mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Review ID</th>
                                    <th>Post ID</th>
                                    <th>User ID</th>
                                    <th>Date</th>
                                    <th>Comment</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.map((review) => (
                                    <tr key={review.reviewId}>
                                        <td>{review.reviewId}</td>
                                        <td>{review.postId}</td>
                                        <td>{review.id}</td>
                                        <td>{review.date}</td>
                                        <td>{review.comment}</td>
                                        <td>{review.rating}</td>
                                        <td>
                                            <Button variant="warning" size="sm" className="me-2">
                                                Reply
                                            </Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteReview(review.reviewId)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}