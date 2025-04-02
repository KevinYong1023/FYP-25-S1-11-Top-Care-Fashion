import React, { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Card, Button, Spinner } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";

const Home = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/products/latest");
        const data = await res.json();
        setLatestProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load latest products:", err);
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <>
      <UserHeader loginStatus={true} />

      {/* Banner */}
      <div style={{ background: "#000", color: "#fff", padding: "60px 20px", textAlign: "center" }}>
        <h1>Welcome to Top Care Fashion</h1>
        <p>Style made simple. Buy, sell, and match your perfect outfit.</p>
      </div>

      {/* Image Carousel with latest product images */}
      <Carousel className="my-4">
        {latestProducts.map((product, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={product.imageUrl}
              alt={product.title}
              style={{ height: "400px", objectFit: "cover" }}
              onError={(e) => (e.target.src = "https://via.placeholder.com/1200x400")}
            />
            <Carousel.Caption>
              <h3>{product.title}</h3>
              <p>${product.price}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Latest Posts Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Latest Posts</h2>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : (
          <Row>
            {latestProducts.map((product, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="h-100 text-center">
                  <Card.Img
                    variant="top"
                    src={product.imageUrl}
                    style={{ objectFit: "cover", height: "300px" }}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
                  />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>${product.price}</Card.Text>
                    <Button variant="primary" href={`/productpage/${product._id}`}>
                      View Product
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Footer */}
      <div style={{ background: "#f8f9fa", padding: "40px 0", textAlign: "center" }}>
        <p>&copy; 2025 Top Care Fashion. All rights reserved.</p>
      </div>
    </>
  );
};

export default Home;
