import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Image } from "react-bootstrap";
import UserHeader from "../Components/Headers/userHeader";
import "../css/ProfitPage.css"; 
import cardigan from "../images/cardigan.jpg";
import poloTee from "../images/poloTee.jpg";
import sandals from "../images/sandals.jpg";


export default function ProfitPage() {
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [totalProductsSold, setTotalProductsSold] = useState(0);
    const [soldProducts, setSoldProducts] = useState([]); // List of sold products

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay

            const products = [
                { id: 1, name: "Cardigan", dateSold: "2025-03-10", price: 37, image: cardigan },
                { id: 2, name: "Polo Tee", dateSold: "2025-03-09", price: 49.5, image: poloTee },
                { id: 3, name: "Sandals", dateSold: "2025-03-08", price: 25, image: sandals },
            ];

            setSoldProducts(products);

            // Dynamically calculate total earnings and number of products sold
            const totalEarningsCalc = products.reduce((sum, product) => sum + product.price, 0);
            setTotalEarnings(totalEarningsCalc);
            setTotalProductsSold(products.length);
        };

        fetchData();
    }, []);

    return (
        <>
            <UserHeader />
            <Container className="dashboard-container">
                <h2 className="title">Seller Dashboard</h2>
                <Row className="justify-content-center">
                    <Col md={5}>
                        <Card className="profit-card">
                            <Card.Body>
                                <h3>Total Earnings</h3>
                                <p className="value">${totalEarnings.toLocaleString()}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={5}>
                        <Card className="profit-card">
                            <Card.Body>
                                <h3>Total Products Sold</h3>
                                <p className="products-sold">{totalProductsSold.toLocaleString()}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sold Products Table */}
                <Row>
                    <Col md={12}>
                        <h3 className="section-title">Sold Products</h3>
                        <Table striped bordered hover className="sold-products-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Date Sold</th>
                                    <th>Price ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {soldProducts.length > 0 ? (
                                    soldProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="product-cell">
                                                <Image 
                                                    src={product.image} 
                                                    alt={product.name} 
                                                    className="product-image"
                                                    thumbnail
                                                />
                                                <span className="items-name">{product.name}</span>
                                            </td>
                                            <td>{product.dateSold}</td>
                                            <td>${product.price.toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center">No products sold yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
