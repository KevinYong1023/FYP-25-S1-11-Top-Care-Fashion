import React, { useState, useEffect, useContext } from "react";
import {AuthContext} from '../../App';
import { Container, Row, Col, Table, Button, Card, Pagination } from "react-bootstrap";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersIndividual() {
  const { userEmail } = useContext(AuthContext); 
  const [userData, setUserData] = useState(null);
  const [productPosts, setProductPosts] = useState([]);
  const [commentsList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [currentPageComments, setCurrentPageComments] = useState(1);
  const productsPerPage = 3;
  const commentsPerPage = 3;

  const fetchUserComments = async (user) => {
    try {
      const response = await fetch(`/api/comments/madeby/${user}`);
      if (!response.ok) throw new Error("Failed to fetch user comments");
      const data = await response.json();
      setCommentList(data);
    } catch (err) {
      console.error("Error fetching user comments:", err);
      setCommentList([]);
    }
  };

  useEffect(() => {
    // Fetch user data based on the ID or username
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userEmail}`);
        const data = await response.json();
        setUserData(data); // Save the user data
        fetchUserProducts(data.email); // Fetch products related to the user's email
        fetchUserComments(data.name);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    // Fetch products associated with this user
    const fetchUserProducts = async (email) => {
      try {
        const response = await fetch(`/api/products/user/${email}`);
        const products = await response.json();
        setProductPosts(products); // Set the product posts in the state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user products:", err);
        setLoading(false);
      }
    };

    fetchUserData(); // Call the function to fetch user data when the component is mounted
  }, [userEmail]);

  const deleteComment = async (commentNo) => {
    try {
      const res = await fetch(`/api/comments/${commentNo}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove from UI
        setCommentList(prev => prev.filter(c => c.commentNo !== commentNo));
      } else {
        console.error("Failed to delete comment");
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // Pagination logic for comments
  const indexOfLastComment = currentPageComments * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentsList.slice(indexOfFirstComment, indexOfLastComment);
  const totalPagesComments = Math.ceil(commentsList.length / commentsPerPage);

  const renderPaginationComments = () => {
    let items = [];
    for (let number = 1; number <= totalPagesComments; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPageComments}
          onClick={() => setCurrentPageComments(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setCurrentPageComments(prev => Math.max(prev - 1, 1))}
          disabled={currentPageComments === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => setCurrentPageComments(prev => Math.min(prev + 1, totalPagesComments))}
          disabled={currentPageComments === totalPagesComments}
        />
      </Pagination>
    );
  };

  // Pagination logic for products
  const indexOfLastProduct = currentPageProducts * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productPosts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPagesProducts = Math.ceil(productPosts.length / productsPerPage);

  const renderPaginationProducts = () => {
    let items = [];
    for (let number = 1; number <= totalPagesProducts; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPageProducts}
          onClick={() => setCurrentPageProducts(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-3">
        <Pagination.Prev
          onClick={() => setCurrentPageProducts(prev => Math.max(prev - 1, 1))}
          disabled={currentPageProducts === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => setCurrentPageProducts(prev => Math.min(prev + 1, totalPagesProducts))}
          disabled={currentPageProducts === totalPagesProducts}
        />
      </Pagination>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ManagerHeader />
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: "100vh" }}>
            <ManagerSidebar />
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="px-md-4">
            {userData && (
              <>
                <h2 className="mt-3">User: {userData.name}</h2>

                {/* Product Posting History */}
                <Card className="p-3 my-4">
                  <h3>Product Posting History</h3>
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-light">
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Date Posted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map((post) => (
                        <tr key={post._id}>
                          <td>{post.title}</td>
                          <td>{post.price}</td>
                          <td>{post.description}</td>
                          <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {renderPaginationProducts()}
                </Card>

                {/* Comments Made */}
                <Card className="p-3 my-4">
                  <h3>Comments Made</h3>
                  <Table striped bordered hover className="mt-3">
                    <thead className="table-light">
                      <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Date Posted</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentComments.map((post) => (
                        <tr key={post.commentNo}>
                          <td>{post.product}</td>
                          <td>{post.description}</td>
                          <td>{new Date(post.created).toLocaleDateString()}</td>
                          <td>
                            <Button variant="danger" onClick={() => deleteComment(post.commentNo)}>
                              Delete Comment
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {renderPaginationComments()}
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
