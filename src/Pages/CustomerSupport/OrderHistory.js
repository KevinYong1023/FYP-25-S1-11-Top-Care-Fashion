import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';  
import AuthorityHeader from '../../Components/Headers/authrotiyHeaders';
import '../../css/OrderHistory.css'; // Import CSS for styling

export default function OrderHistory() {
    const { username } = useParams();  
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // Fetch data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/order-history/${username}`);
                const data = await response.json();
                setTableData(data);
                setFilteredData(data);  
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchData();
    }, [username]);

    return (
        <>
            <AuthorityHeader />
            <Container>
                <Row>
                    <Col xs={12} className="text-center">
                        <h2 className="order-history-title">Order History</h2>
                        <hr />
                    </Col>
                    <Col xs={12} className="d-flex justify-content-center">
                        <table className="table table-bordered order-history-table">
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
