import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Card } from "react-bootstrap";
import ManagerSidebar from "../../Components/Sidebars/ManagerSidebar";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersIndividual({ userEmail }) {
  const [userData, setUserData] = useState(null);
  const [productPosts, setProductPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data based on the ID or username
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/${userEmail}`);
        const data = await response.json();
        setUserData(data); // Save the user data
        fetchUserProducts(data.email);  // Fetch products related to the user's email
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
  }, [userEmail]);  // Re-fetch if the ID changes

  if (loading) {
    return <div>Loading...</div>;

  }
  // Handle deleting a product
  const handleDelete = async (productId) => {
    try {
      // Send a DELETE request to the backend to delete the product
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // If deletion is successful, update the product list
        setProductPosts(productPosts.filter(post => post._id !== productId));
      } else {
        console.error("Error deleting product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productPosts.map((post) => (
                        <tr key={post._id}> {/* Use the correct unique ID */}
                          <td>{post.title}</td> {/* Correct field name to display product name */}
                          <td>{post.price}</td>
                          <td>{post.description}</td>
                          <td>{new Date(post.createdAt).toLocaleDateString()}</td> {/* Format the date */}
                          <td>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(post._id)} >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
