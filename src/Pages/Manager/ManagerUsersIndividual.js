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
        fetchUserComments(data.name);
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
       <div style={{ flex: '1', padding: '40px' }}>
        {!error ? <></> : (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center" style={{ marginTop: '100px' }}>
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading</span>
            </Spinner>
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          userData && (
            <>
              <h2 className="mt-3">User: {userData.name}</h2>

              {/* Product Posting History */}
              <div className="card p-3 my-4">
                <h3>Product Posting History</h3>
                <table className="table table-striped table-bordered mt-3">
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
                </table>
                {renderPaginationProducts()}
              </div>

              {/* Comments Made */}
              <div className="card p-3 my-4">
                <h3>Comments Made</h3>
                <table className="table table-striped table-bordered mt-3">
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
                </table>
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
