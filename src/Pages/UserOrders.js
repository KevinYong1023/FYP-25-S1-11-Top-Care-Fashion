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

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`/api/order-history`);
            const data = await response.json();
            const availableOrder = data.filter(order=>order.status !== "Completed")
            const sellOrders = availableOrder.filter(order =>
                order.seller.some(s => s.sellerName === name) && order.seller.some(s => s.status !== 'Delivered')
            );
            setSellList(sellOrders);

            const buyOrders = availableOrder.filter(order => order.buyerName === name);
            setBuyList(buyOrders);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    useEffect(() => {
        if (name) {
            fetchOrderDetails();
        }
    }, [name]);

    const handleStatusChange = (orderNumber, sellerIndex, newStatus) => {
        setUpdatedStatus(prev => {
            const updatedOrder = prev[orderNumber] || [];
            updatedOrder[sellerIndex] = newStatus;
            return {
                ...prev,
                [orderNumber]: updatedOrder,
            };
        });
    };

    const saveStatus = async (orderNumber, sellerName, newStatus, productName) => {
        try {
            const response = await fetch(`/api/update-order-status/${orderNumber}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sellerName, status: newStatus }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                alert(data.message || "Failed to update order status");
            } else {
                alert("Order Updated");
    
                // 🟢 If status is Delivered, set isOrdered to false for product
                if (newStatus === "Delivered") {
                    try {
                        const res = await fetch(`/api/products/update-product-status`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ productName, isOrdered: false }),
                        });
    
                        const updateData = await res.json();
                        if (res.ok) {
                            console.log("Product order status updated:", updateData.product);
                        } else {
                            console.error("Failed to update:", updateData.message);
                            alert(`Product order status update failed: ${updateData.message}`);
                        }
                    } catch (err) {
                        console.error("Error updating product order status:", err);
                        alert("Error updating product status.");
                    }
                }
    
                // 🔄 Refresh the order details view
                fetchOrderDetails();
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("An unexpected error occurred while updating order status.");
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
                                    <td>{item.status}</td>
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
                            <th>Product Price</th>
                            <th>Date</th>
                            <th>Order Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sellList.map((row) =>
                            row.seller.map((item, sellerIndex) => (
                                item.sellerName === name && (
                                    <tr key={`${row.orderNumber}-${sellerIndex}`}>
                                        <td>{row.orderNumber}</td>
                                        <td>{row.buyerName}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.price}</td>
                                        <td>{new Date(row.created).toLocaleString()}</td>
                                        <td>{row.total}</td>
                                        <td>
                                            <Form.Select
                                            disabled={item.status === "Delivered"}
                                                value={updatedStatus[row.orderNumber]?.[sellerIndex] || item.status}
                                                onChange={(e) =>
                                                    handleStatusChange(row.orderNumber, sellerIndex, e.target.value)
                                                }
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </Form.Select>
                                        </td>
                                        <td>
                                            
                                               { item.status === "Delivered" ?<></> :
                                            <>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() =>
                                                    saveStatus(
                                                        row.orderNumber,
                                                        item.sellerName,
                                                        updatedStatus[row.orderNumber]?.[sellerIndex] || item.status, 
                                                        item.productName 
                                                    )
                                                }
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
                                            </>
}
                                                                               </td>
                                    </tr>
                                )
                            ))
                        )}
                    </tbody>
                </table>
            </Container>
        </>
    );
}
