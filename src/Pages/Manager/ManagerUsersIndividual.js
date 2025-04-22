import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../App';
import { Container, Row, Col, Table, Button, Card, Pagination, Spinner } from "react-bootstrap";
import ManagerHeader from "../../Components/Headers/ManagerHeader";

export default function ManagerUsersIndividual() {
  const { userEmail } = useContext(AuthContext); 
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [productPosts, setProductPosts] = useState([]);
  const [commentsList, setCommentList] = useState([]);
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [currentPageComments, setCurrentPageComments] = useState(1);
  const productsPerPage = 3;
  const commentsPerPage = 3;

  const fetchUserComments = async (user) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/comments/madeby/${user}`);
      if (!response.ok) throw new Error("Failed to fetch user comments");
      const data = await response.json();
      setCommentList(data);
    } catch (err) {
      setError("Server Error: Please Refresh the Page")
      console.error("Error fetching user comments:", err);
      setCommentList([]);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    // Fetch user data based on the ID or username
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/user/${userEmail}`);
        const data = await response.json();
        setUserData(data); // Save the user data
        fetchUserProducts(data.email); // Fetch products related to the user's email
        if(data.name){
           fetchUserComments(data.name);
        }
      } catch (err) {
        setError("Server Error: Please Refresh the Page")
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false)
      }
    };

    // Fetch products associated with this user
    const fetchUserProducts = async (email) => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/products/user/${email}`);
        const products = await response.json();
        setProductPosts(products); // Set the product posts in the state
        setIsLoading(false);
      } catch (err) {
        setError("Server Error: Please Refresh the Page")
        console.error("Error fetching user products:", err);
        setIsLoading(false);
      } finally {
        setIsLoading(false)
      }
    };

    fetchUserData(); // Call the function to fetch user data when the component is mounted
  }, [userEmail]);

  const deleteComment = async (commentNo) => {
    try {
      setIsLoading(true)
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
      setError("Server Error: Please Try Again")
      console.error("Error deleting comment:", err);
    } finally {
      setIsLoading(false)
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


  return (
    <>
      <ManagerHeader />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Main Content */}
        <div style={{ flex: '1', padding: '40px', backgroundColor: '#f9f9f9' }}>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
  
          {isLoading? (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status" variant="primary" />
              <p className="mt-2">Loading...</p>
            </div>
          ) : (
            userData && (
              <>
              <h2 style={{ color: '#6e4f37', fontWeight:"bold"}}> User: {userData.name}</h2>

                <hr />
  
                {/* Product Posting History */}
                <div
                  className="p-4 mb-4"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <h4 style={{ color: '#4a4e69', fontSize: '28px' }}>Product Posting History</h4>
                  <Table
                    className="table table-hover table-striped mt-3"
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <thead style={{ backgroundColor: '#a5a58d', color: '#ffffff' }}>
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
                </div>
  
                {/* Comments Made */}
                <div
                  className="p-4"
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <h4 style={{ color: '#4a4e69', fontSize: '28px' }}>Comments Made</h4>
                  <Table
                    className="table table-hover table-striped mt-3"
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                    }}
                  >
                    <thead style={{ backgroundColor: '#a5a58d', color: '#ffffff' }}>
                      <tr>
                        <th>Product Name</th>
                        <th>Description</th>
                        <th>Date Posted</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentComments.map((post) => (
                        <tr key={post.commentNo}>
                          <td>{post.product}</td>
                          <td>{post.description}</td>
                          <td>{new Date(post.created).toLocaleDateString()}</td>
                          <td className="text-center">
                            <Button
                              variant="danger"
                              size="lg"
              style={{ fontSize: '16px' }}
                              onClick={() => deleteComment(post.commentNo)}
                            >
                              Delete Comment
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {renderPaginationComments()}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
  
}
