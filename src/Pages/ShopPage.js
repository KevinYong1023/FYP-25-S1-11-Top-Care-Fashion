import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserHeader from "../Components/Headers/userHeader";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    Top: false,
    Bottom: false,
    Footwear: false,
    Under20: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const limit = 9;

  const fetchProducts = async () => {
    const categoryList = Object.entries(filters)
      .filter(([key, value]) => value && key !== "Under20")
      .map(([key]) => key);

    const queryParams = new URLSearchParams({
      query,
      categories: categoryList.join(","),
      maxPrice: filters.Under20 ? "20" : "",
      page: currentPage,
      limit,
    });

    try {
      const res = await fetch(`/api/products/search?${queryParams.toString()}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [query, filters, currentPage]);

  const handleCheckboxChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  // ✅ UPDATED: Navigate to /productpage/:id
  const goToProduct = (id) => {
    navigate(`/productpage/${id}`);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return <Pagination>{pages}</Pagination>;
  };

  return (
    <>
      <UserHeader loginStatus={true} />
      <Container fluid className="mt-4">
        <Form className="mb-3 text-center" onSubmit={handleSearch}>
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: "500px", margin: "0 auto" }}
          />
        </Form>

        <Row>
          {/* Filter Sidebar */}
          <Col md={2}>
            <Card className="p-3">
              <h5><strong>Shop By</strong></h5>
              <Form.Check
                type="checkbox"
                label="All"
                name="All"
                onChange={() => {
                  setFilters({
                    Top: false,
                    Bottom: false,
                    Footwear: false,
                    Under20: false,
                  });
                  setQuery("");
                }}
              />
              <Form.Check
                type="checkbox"
                label="Top"
                name="Top"
                checked={filters.Top}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                type="checkbox"
                label="Bottom"
                name="Bottom"
                checked={filters.Bottom}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                type="checkbox"
                label="Footwear"
                name="Footwear"
                checked={filters.Footwear}
                onChange={handleCheckboxChange}
              />
              <Form.Check
                type="checkbox"
                label="Under $20"
                name="Under20"
                checked={filters.Under20}
                onChange={handleCheckboxChange}
              />
            </Card>
          </Col>

          {/* Product Cards */}
          <Col md={10}>
            <Row>
              {products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                products.map((product) => (
                  <Col md={4} className="mb-4" key={product._id}>
                    <Card className="h-100">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        style={{
                          objectFit: "cover",
                          height: "250px",
                          width: "100%",
                        }}
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/250")
                        }
                      />
                      <Card.Body>
                          <Card.Title>{product.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            ${product.price}
                          </Card.Subtitle>
                          <Card.Text>Category: {product.category}</Card.Text>
                          
                            <Card.Text><strong>Seller: {product.seller}</strong></Card.Text>
                          <Button
                            variant="primary"
                            onClick={() => goToProduct(product._id)}
                          >
                            View Product
                          </Button>
                        </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>

            {/* Pagination */}
            <div className="mt-3 d-flex justify-content-center">
              {renderPagination()}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ShopPage;
