import React, { useState } from "react";
import { Table, Button, Container, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import UserHeader from "../Components/Headers/userHeader";
import denim from "../images/denim.jpg";
import shoe from "../images/shoe.jpg";
import hoodie from "../images/hoodie.jpg";
import "../css/ManageList.css";

const ManageList = () => {
    const [listings, setListings] = useState([
        {
            id: 1,
            image: denim,
            name: "Denim Jacket",
            datePosted: "2025-03-10",
            price: 50,
        },
        {
            id: 2,
            image: shoe,
            name: "Nike Dunk Low Panda Black and White",
            datePosted: "2025-03-02",
            price: 75,
        },
        {
            id: 3,
            image: hoodie,
            name: "Essential Hoodie",
            datePosted: "2025-02-08",
            price: 40,
        },
    ]);

    const handleDelete = (id) => {
        setListings((prevListings) => prevListings.filter((item) => item.id !== id));
    };

    return (
        <>
            <UserHeader />
            <Container className="manage-list-container mt-4">
                <h2 className="managing-header">Manage Listings</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th className="text-center">Product</th>
                            <th></th>
                            <th>Date Posted</th>
                            <th>Price ($)</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.length > 0 ? (
                            listings.map((listing) => (
                                <tr key={listing.id}>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center">
                                            <Image 
                                                src={listing.image} 
                                                alt={listing.name} 
                                                height={100} 
                                                style={{ width: "auto" }} 
                                                rounded 
                                            />
                                        </div>
                                    </td>
                                    <td>{listing.name}</td>
                                    <td>{listing.datePosted}</td>
                                    <td>${listing.price}</td>
                                    <td className="text-center">
                                        <Button
                                            variant="link"
                                            onClick={() => handleDelete(listing.id)}
                                            className="text-danger"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No listings available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default ManageList;
