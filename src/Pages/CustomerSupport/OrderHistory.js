import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import orderData from '../../mockdata/orderhistory.json'; // Import the JSON data
import { Link } from 'react-router-dom';

export default function OrderHistory() {
    // State to store the fetched data
    const [tableData, setTableData] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // State to store search input
    const [filteredData, setFilteredData] = useState([]); // State to store filtered data

    // Load data from JSON file
    useEffect(() => {
        // Set the imported JSON data directly into state
        setTableData(orderData);
        setFilteredData(orderData); // Initialize the filtered data with the complete data
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter table data by invoice ID or seller name
        const filtered = tableData.filter((row) => {
            const invoiceId = row.inv.toString().toLowerCase(); // Convert ID to string for comparison
            const sellerName = row.seller.toLowerCase(); // Convert seller name to lowercase
            return invoiceId.includes(query) || sellerName.includes(query); // Match by ID or name
        });

        setFilteredData(filtered); // Update the filtered data
    };

    return (
        <>
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar - fixed width, no padding */}
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>

                    {/* Main Content */}
                    <Col md={10} style={{ padding: '20px' }}>
                        <div>
                            Search: <input type='text' value={searchQuery} onChange={handleSearch} />
                        </div>
                        <br/>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Status</th>
                                    <th>Seller</th>
                                    <th>Date Purchase</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row) => (
                                    <tr key={row.inv}>
                                        <td>{row.inv}</td>
                                        <td>{row.status}</td>
                                        <td>{row.seller}</td>
                                        <td>{row.purchase_date}</td>
                                        <td>
                                            <Link to={`/order-details/${row.inv}`}>
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr>
                                        <td colSpan="5">No results found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
