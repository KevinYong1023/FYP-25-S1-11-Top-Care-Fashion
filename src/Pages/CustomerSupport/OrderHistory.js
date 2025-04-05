import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { useParams } from 'react-router-dom';  // To get the URL params
import Sidebar from '../../Components/Sidebars/Sidebar';
import AuthorityHeader from '../../Components/Headers/CustomerSupportHeader';

export default function OrderHistory() {
    const { name } = useParams();  // Get the username from the URL
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const ordersPerPage = 10; // Number of orders per page

    // Fetch data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/order-history`);
                const data = await response.json();
                const filtered = data.filter(order =>
                    order.buyer === name || order.seller === name
                );
    
                setFilteredData(filtered);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchData();
    }, [name]);

    // Pagination Logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredData.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredData.length / ordersPerPage);

    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item
                    key={number}
                    active={number === currentPage}
                    onClick={() => setCurrentPage(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />
                {items}
                <Pagination.Next
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        );
    };

    return (
        <>
            <AuthorityHeader />
            <Container fluid>
                <Row className="d-flex">
                    <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <Sidebar />
                    </Col>

                    <Col md={10} style={{ padding: '20px' }}>
                        <h2>Order History</h2>
                        <hr />
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Status</th>
                                    <th>Seller</th>
                                    <th>Total</th>
                                    <th>Date Purchase</th>
                                    <th>Buyer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((row) => (
                                    <tr key={row.orderNumber}>
                                        <td>{row.orderNumber}</td>
                                        <td>{row.status}</td>
                                        <td>{row.seller}</td>
                                        <td>{row.total}</td>
                                        <td>{row.purchased}</td>
                                        <td>{row.buyer}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {renderPagination()}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
