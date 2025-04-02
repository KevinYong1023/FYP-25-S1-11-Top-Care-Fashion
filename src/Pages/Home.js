import React from "react";
import { Container, Image } from "react-bootstrap";
import UserHeader from '../Components/Headers/userHeader';
import '../css/Home.css';

const Home = () => {
    const products = [
        { name: 'Stylish Jacket', brand: 'Brand A', price: '$49.99', imageUrl: 'https://source.unsplash.com/300x200/?sneakers' },
        { name: 'Casual Sneakers', brand: 'Brand B', price: '$39.99', imageUrl: 'https://source.unsplash.com/300x200/?sneakers' },
        { name: 'Elegant Dress', brand: 'Brand C', price: '$59.99', imageUrl: 'https://source.unsplash.com/300x200/?dress' },
        { name: 'Sporty Watch', brand: 'Brand D', price: '$99.99', imageUrl: 'https://source.unsplash.com/300x200/?watch' },
        { name: 'Classic Sunglasses', brand: 'Brand E', price: '$29.99', imageUrl: 'https://source.unsplash.com/300x200/?sunglasses' },
        { name: 'Trendy Backpack', brand: 'Brand F', price: '$34.99', imageUrl: 'https://source.unsplash.com/300x200/?backpack' },
    ];

    return (
        <main className="home-page">
            <UserHeader loginStatus={true} />

            {/* Image Wrapper for Side-by-Side Layout */}
            <section className="image-container-wrapper">
                <figure className="image-container">
                    <Image
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Poster 2"
                        fluid
                        rounded
                        className="main-image-poster"
                    />
                </figure>
                <figure className="image-container">
                    <Image
                        src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Poster 3"
                        fluid
                        rounded
                        className="main-image-poster"
                    />
                </figure>
            </section>

            <Container as="section" className="product-container">
                <h2 className="product-heading">Featured Products</h2>
                <ul className="product-grid">
                    {products.map((product, index) => (
                        <li className="product" key={index}>
                            <article className="product-details">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-brand">{product.brand}</p>
                                <p className="product-price">{product.price}</p>
                            </article>
                        </li>
                    ))}
                </ul>
            </Container>
        </main>
    );
};

export default Home;
 