import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import UserHeader from '../Components/Headers/userHeader';
import { useNavigate } from 'react-router-dom';

export default function UserOrders({ email }) {
    const [buyList, setBuyList] = useState([]);
    const [sellList, setSellList] = useState([]);
    const [name, setName] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState({});

    const navigate = useNavigate();

    // Fetch user details based on email
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    const response = await fetch(`/api/user/${email}`);
                    const data = await response.json();
                    setName(data.name);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    // Fetch order details based on the user's name
    useEffect(() => {
        if (name) {
            const fetchOrderDetails = async () => {
                try {
                    const response = await fetch(`/api/order-history`);
                    const data = await response.json();

                    // Filter sell orders where the user's name is in the seller list
                    const sellOrders = data.filter(order =>
                        order.seller.some(s => s.sellerName === name)
                    );
                    setSellList(sellOrders);

                    // Filter buy orders where the user is the buyer
                    const buyOrders = data.filter(order => order.buyerName === name);
                    setBuyList(buyOrders);
                } catch (error) {
                    console.error('Error fetching order history:', error);
                }
            };

            fetchOrderDetails();
        }
    }, [name]);

    // Handle status change in dropdown
    const handleStatusChange = (orderNumber, newStatus) => {
        setUpdatedStatus(prev => ({
            ...prev,
            [orderNumber]: newStatus,
        }));
    };

    const saveStatus = async (orderId) => {
        const newStatus = updatedStatus[orderId] || 'Processing'; // Default to 'Processing' if no status is selected
        try {
            const response = await fetch(`/api/update-order-status/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ updatedStatus: newStatus }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    function createTicket(orderId) {
        navigate(`/create-ticket/${orderId}`);
    }

    return (
        <>
            <UserHeader loginStatus={true} />
            <Container fluid>
                <h2>Your Orders:</h2>
                <hr />
                <h3>Buy:</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Order No.</th>
                            <th>Seller</th>
                            <th>Product</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {buyList.map((row) =>
                        row.seller.map((item, index) => (
                            <tr key={`${row.orderNumber}-${index}`}>
                                <td>{row.orderNumber}</td>
                                <td>{item.sellerName}</td>
                                <td>{item.productName}</td>
                                <td>{new Date(row.created).toLocaleString()}</td>
                                <td>{row.total}</td>
                                <td>{row.status}</td>
                                <td>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => createTicket(row.orderNumber)}
                                    >
                                        Raise a Ticket
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <hr />
                <h3>Sold:</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Order No.</th>
                            <th>Buyer</th>
                            <th>Product</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {sellList.map((row) => (
                        <tr key={row.orderNumber}>
                            <td>{row.orderNumber}</td>
                            <td>{row.buyerName}</td>
                            <td>{row.seller[0]?.productName}</td>
                            <td>{row.created}</td>
                            <td>{row.total}</td>
                            <td>
                                <Form.Select
                                    value={updatedStatus[row.orderNumber] || row.status}
                                    onChange={(e) => handleStatusChange(row.orderNumber, e.target.value)}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </Form.Select>
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => saveStatus(row.orderNumber)}
                                >
                                    Update Status
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => createTicket(row.orderNumber)}
                                >
                                    Raise a Ticket
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Container>
        </>
    );
}
