import React from "react";  
import { Container } from "react-bootstrap";  
import UserHeader from '../Components/Headers/userHeader'; // Adjust the path based on your file structure  
import '../css/Home.css'; // Import your CSS for styling  

const Home = () => {  
    // Sample product data with image URLs  
    const products = [  
        { name: 'Stylish Jacket', brand: 'Brand A', price: '$49.99', imageUrl: 'https://via.placeholder.com/200' },  
        { name: 'Casual Sneakers', brand: 'Brand B', price: '$39.99', imageUrl: 'https://via.placeholder.com/200' },  
        { name: 'Elegant Dress', brand: 'Brand C', price: '$59.99', imageUrl: 'https://via.placeholder.com/200' },  
        { name: 'Sporty Watch', brand: 'Brand D', price: '$99.99', imageUrl: 'https://via.placeholder.com/200' },  
        { name: 'Classic Sunglasses', brand: 'Brand E', price: '$29.99', imageUrl: 'https://via.placeholder.com/200' },  
        { name: 'Trendy Backpack', brand: 'Brand F', price: '$34.99', imageUrl: 'https://via.placeholder.com/200' },  
    ];  

    return (  
        <div>  
            <UserHeader loginStatus={false} /> {/* Pass the login status as needed */}  

            <Container className="product-container">  
                <h2 className="text-center mb-4">Featured Products</h2>  
                <div className="product-grid">  
                    {products.map((product, index) => (  
                        <div className="product" key={index}>  
                            <div className="product-image" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>  
                            <div className="product-name">{product.name}</div>  
                            <div className="product-brand">{product.brand}</div>  
                            <div className="product-price">{product.price}</div>  
                        </div>  
                    ))}  
                </div>  
            </Container>  

            <div className="main-image"></div>  
        </div>  
    );  
};  

export default Home;  

/*

const Home = () => {
    return (
        <>
        <UserHeader loginStatus={false}/>
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
            <h1 className="mb-4">Welcome to <span className="text-primary">Top Care Fashion</span></h1>
            <p className="lead">Discover the latest trends in fashion with us!</p>
            
            <div className="mt-4">
                <Link to="/register">
                    <Button variant="primary" className="me-3">Register</Button>
                </Link>
                <Link to="/login">
                    <Button variant="outline-primary">Login</Button>
                </Link>
            </div>
        </Container>
         </>
    );
};

export default Home;
*/