import React, { useState } from 'react';
import '../css/MixMatch.css';
import UserHeader from '../Components/Headers/userHeader';
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const MixMatch = () => {
    const [occasion, setOccasion] = useState("");

    function handleMixMatch(e){
        e.preventDefault(); 
        // Add your logic here
        alert("TRIGGER MIX AND MATCH")
    }

    function addProductsToCart(){
        // Add your logic here
        alert("TRIGGER Add to cart")
    }

    return (
        <>
            <UserHeader loginStatus={true} />

            <Container className="my-4">
                {/* Input Section */}
                <Row className="justify-content-center mb-4">
                    <Col md={6} className="d-flex align-items-center gap-2">
                    <Form onSubmit={ handleMixMatch}>
                        <Form.Control
                            type="text"
                            placeholder="Input an occasion"
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                        />
                        <Button type="submit">Mix-And-Match</Button>
                    </Form>
                    </Col>
                </Row>

                <Row>
<Col md={6}>
    <h4>Results</h4>

    <Card className="mb-3 p-3 text-center">
        <Card.Title>Top</Card.Title>
        <Card.Img 
            variant="top" 
            src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&auto=format&fit=crop" 
            alt="Top Item" 
            style={{ maxHeight: "250px", objectFit: "cover" }} 
        />
    </Card>

    <Card className="mb-3 p-3 text-center">
        <Card.Title>Bottom</Card.Title>
        <Card.Img 
            variant="top" 
            src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&auto=format&fit=crop" 
            alt="Bottom Item" 
            style={{ maxHeight: "250px", objectFit: "cover" }} 
        />
    </Card>

    <Card className="mb-3 p-3 text-center">
        <Card.Title>Footwear</Card.Title>
        <Card.Img 
            variant="top" 
            src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500&auto=format&fit=crop" 
            alt="Footwear Item" 
            style={{ maxHeight: "250px", objectFit: "cover" }} 
        />
    </Card>
</Col>

                    {/* Right: Details and Add to Cart */}
                    <Col md={6}>
                        <h4>Items Details</h4>
                        <Card className="mb-3 p-3">
                            <Card.Title>Top</Card.Title>
                            <Card.Text>Description: $XX</Card.Text>
                            <Card.Text>Price: $XX</Card.Text>
                            <Card.Text>Seller: ABC</Card.Text>
                        </Card>

                        <Card className="mb-3 p-3">
                            <Card.Title>Bottom</Card.Title>
                            <Card.Text>Description: $XX</Card.Text>
                            <Card.Text>Price: $XX</Card.Text>
                            <Card.Text>Seller: XYZ</Card.Text>
                        </Card>

                        <Card className="mb-3 p-3">
                            <Card.Title>Footwear</Card.Title>
                            <Card.Text>Description: $XX</Card.Text>
                            <Card.Text>Price: $XX</Card.Text>
                            <Card.Text>Seller: DEF</Card.Text>
                        </Card>

                        <Button variant="success" className="mt-2" onClick={addProductsToCart}>Add to Cart</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default MixMatch;
