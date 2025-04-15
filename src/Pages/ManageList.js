import React, { useEffect, useState } from "react";
import { Table, Button, Form, Image, Container, Alert, Pagination } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";

const ManageList = ({ email }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    if (email) {
      fetch(`/api/products/user/${email}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Failed to fetch listings:", err));
    }
  }, [email]);

  const handleChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleUpdate = async (product) => {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        setMessage("Product updated successfully.");
      } else {
        setMessage("Error updating product.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during update.");
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
      <Container className="mt-4">
        <h2>Manage Listings</h2>
        {message && <Alert variant="info">{message}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Product</th>
              <th>Image URL</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product._id}>
                <td>
                  <Image
                    src={product.imageUrl}
                    alt="Product"
                    width="80"
                    height="80"
                    rounded
                    onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={product.imageUrl}
                    readOnly
                    style={{ backgroundColor: "#e9ecef", pointerEvents: "none" }}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={product.title}
                    onChange={(e) => handleChange(index, "title", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={product.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={product.price}
                    onChange={(e) => handleChange(index, "price", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={product.category}
                    readOnly
                    style={{ backgroundColor: "#e9ecef", pointerEvents: "none" }}
                  />
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleUpdate(product)}
                    className="me-2"
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
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
      </Container>
    </>
  );
};

export default ManageList;
