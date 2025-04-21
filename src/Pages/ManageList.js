import React, { useEffect, useState } from "react";
import { Table, Button, Form, Image, Spinner, Alert, Pagination } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";

const ManageList = ({ email }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [error,setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false); 

  const getUserProduct = async () => {
    if (email) {
      try {
        setIsLoading(true); // Set loading to true when fetch starts
        const response = await fetch(`/api/products/user/${email}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Please Refresh the page and try again");
        console.error("Failed to fetch listings:", error);
      } finally {
        setMessage("")
        setIsLoading(false); // Always set loading to false at the end
      }
    }
  };
  
  useEffect(() => {
    if (email) {
      getUserProduct()
    }
  }, [email]);

  const handleChange = (index, field, value) => {
    setMessage("");
    setError("");
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleUpdate = async (product) => {
    const updateCheck = product.price && product.title && product.description
    if(updateCheck){
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
        title: product.title,
        description: product.description,
        price: product.price,
      });

      if (res.ok) {
        setMessage("Product updated successfully.");
        getUserProduct();
      } else {
        setError("Error updating product.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error during update.");
    }
  }else{
    setError("Empty Field: Please FIll Up the Details.")
  }
};

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

            if (res.ok) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
                setMessage("Product deleted.");
            } else {
                setMessage("Error deleting product.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error during delete.");
        }
    };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <UserHeader loginStatus={true} />
      <div className="mt-4 px-3">
        <h2>Manage Listings</h2>
  
        {message && <Alert variant="info">{message}</Alert>}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
  
        {isLoading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" role="status" variant="primary" />
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          <>
            <Table bordered hover responsive style={{ fontSize: "20px" }}>
              <thead
                style={{
                  background: "linear-gradient(to right, #dfe9f3, #ffffff)",
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "20px"
                }}
              >
                <tr className="text-center" >
                  <th>Product</th>
                  <th>Category</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Price ($)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr
                    key={product._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      verticalAlign: "middle",
                      borderBottom: "1px solid #dee2e6"
                    }}
                  >
                    <td width="180px" className="text-center">
                      <Image
                        src={product.imageUrl}
                        alt="Product"

                        rounded
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/120")
                        }
                      />
                    </td>
                    <td className="text-capitalize text-center">{product.category}</td>
                    <td>
                      <Form.Control
                        type="text"
                        value={product.title}
                        onChange={(e) => handleChange(index, "title", e.target.value)}
                        style={{ fontSize: "20px" }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={product.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        style={{ fontSize: "20px" }}
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={product.price}
                        onChange={(e) => handleChange(index, "price", e.target.value)}
                        style={{ fontSize: "20px" }}
                      />
                    </td>
                    <td className="text-center">
                      <Button
                        variant="success"
                        size="sm"
                        disabled={product.isOrdered}
                        onClick={() => handleUpdate(product)}
                        className="me-2"
                        style={{ fontSize: "20px" }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={product.isOrdered}
                        onClick={() => handleDelete(product._id)}
                        style={{ fontSize: "20px" }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </>
        )}
      </div>
    </>
  );
  
};

export default ManageList;