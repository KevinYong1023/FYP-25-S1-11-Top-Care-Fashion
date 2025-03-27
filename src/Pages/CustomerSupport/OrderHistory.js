import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';  // To get the URL params
import Sidebar from '../../Components/Sidebars/Sidebar';
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';

export default function OrderHistory() {
    const { username } = useParams();  // Get the username from the URL
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Fetch data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/order-history/${username}`);
                const data = await response.json();
                setTableData(data);
                setFilteredData(data);  // Initialize filtered data
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchData();
    }, [username]);

  

    return (
        <>
        <AuthorityHeader/>
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>

                    <Col md={10} style={{ padding: '20px' }}>
                        <h2>Order History</h2>
                        <hr/>
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
                                    <tr key={row._id}>
                                        <td>{row._id}</td>
                                        <td>{row.status}</td>
                                        <td>{row.seller}</td>
                                        <td>{row.purchased}</td>
                                        <td>
                                            <a href={`/order-details/${row._id}/${username}`}>Review</a>
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
