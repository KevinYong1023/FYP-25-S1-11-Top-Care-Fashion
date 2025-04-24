import React, { useState, useEffect } from "react";
import { Container, Spinner, Pagination, Button, Form } from 'react-bootstrap';
import UserHeader from '../Components/Headers/userHeader';
import { useNavigate } from 'react-router-dom';

export default function UserOrders({ email }) {
    const [buyList, setBuyList] = useState([]);
    const [sellList, setSellList] = useState([]);
    const [name, setName] = useState("");
    const [updatedStatus, setUpdatedStatus] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (email) {
                try {
                    setIsLoading(true);
                    const response = await fetch(`/api/user/${email}`);
                    const data = await response.json();
                    setName(data.name);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchUserDetails();
    }, [email]);

    const fetchOrderDetails = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/order-history`);
            const data = await response.json();
            setUpdatedStatus({});
            const availableOrder = data.filter(order => order.status !== "Completed");
            const sellOrders = availableOrder.filter(order =>
                order.seller.some(s => s.sellerName === name) && order.seller.some(s => s.status !== 'Delivered')
            );
            setSellList(sellOrders);
            const buyOrders = availableOrder.filter(order => order.buyerName === name);
            console.log("buyOrders",buyOrders)

            setBuyList(buyOrders);
        } catch (error) {
            console.error('Error fetching order history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (name) {
            fetchOrderDetails();
        }
    }, [name]);

    const handleStatusChange = (orderNumber, sellerIndex, newStatus) => {
        setUpdatedStatus(prev => {
            const prevOrder = prev[orderNumber] || {};
            return {
                ...prev,
                [orderNumber]: {
                    ...prevOrder,
                    [sellerIndex]: newStatus,
                }
            };
        });
    };
    
    const saveStatus = async (orderNumber, sellerName, newStatus, productName) => {    
        try {
            setIsLoading(true);
            const response = await fetch(`/api/update-order-status/${orderNumber}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ sellerName, productName, status: newStatus }),
            });
    
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || "Failed to update order status");
            } else {    
                // Only update product status if seller marked it as Delivered
                if (newStatus === "Delivered") {
                    const res = await fetch(`/api/products/update-product-status`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ productName, seller: sellerName, isOrdered: false }),
                    });
    
                    const updateData = await res.json();
                    console.log(updateData)
                    if (!res.ok) {
                        console.error("Failed to update product:", updateData.message);
                        alert(`Product status update failed: ${updateData.message}`);
                    }
                }
    
                fetchOrderDetails(); // Refresh order list
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Unexpected error occurred while updating order status.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const createTicket = (orderId) => {
        navigate(`/create-ticket/${orderId}`);
    };


    return (
        <>
            <UserHeader loginStatus={true} />
            <Container fluid>
                <h2>Your Orders:</h2>
                <hr />
                {isLoading ? (
                    <div className="text-center my-3">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading...</p>
                    </div>
                ):(<>
                <h3>Buy:</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Order No.</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Seller</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Product</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Product Price</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Date</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Order Total</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Status</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buyList.map((row) =>
                            row.seller.map((item, index) => (
                                <tr key={`${row.orderNumber}-${item.productName}-${index}`}>
                                    <td>{row.orderNumber}</td>
                                    <td>{item.sellerName}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.price}</td>
                                    <td>{new Date(row.created).toLocaleString()}</td>
                                    <td>{row.total}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <Button
                                            size="sm"
                                            onClick={() => createTicket(row.orderNumber)}
                                            style={{
                                                backgroundColor: "#97a97c",
                                                borderColor: "#97a97c",
                                                color: "white",
                                                transition: "background-color 0.3s ease",
                                              }}
                                              onMouseOver={(e) => {
                                                e.target.style.backgroundColor = "#85986c";
                                                e.target.style.borderColor = "#85986c";
                                              }}
                                              onMouseOut={(e) => {
                                                e.target.style.backgroundColor = "#97a97c";
                                                e.target.style.borderColor = "#97a97c";
                                              }}
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
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Order No.</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Buyer</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Product</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Product Price</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Date</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Order Total</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Status</th>
                            <th style={{ backgroundColor: "#6b705c", color: "white" }}>Action</th>
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
                                            </Form.Select>
                                        </td>
                                        <td>
                                            
                                               { item.status === "Delivered" ?<></> :
                                            <>
                                            <Button
                                                    className="me-2"
                                                style={{
                                                    backgroundColor: "#97a97c",
                                                    borderColor: "#97a97c",
                                                    color: "white",
                                                    transition: "background-color 0.3s ease",
                                                  }}
                                                  onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = "#85986c";
                                                    e.target.style.borderColor = "#85986c";
                                                  }}
                                                  onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = "#97a97c";
                                                    e.target.style.borderColor = "#97a97c";
                                                  }}
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
                                                style={{
                                                    backgroundColor: "#97a97c",
                                                    borderColor: "#97a97c",
                                                    color: "white",
                                                    transition: "background-color 0.3s ease",
                                                  }}
                                                  onMouseOver={(e) => {
                                                    e.target.style.backgroundColor = "#85986c";
                                                    e.target.style.borderColor = "#85986c";
                                                  }}
                                                  onMouseOut={(e) => {
                                                    e.target.style.backgroundColor = "#97a97c";
                                                    e.target.style.borderColor = "#97a97c";
                                                  }}
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
                </table> </>)}
            </Container>
        </>
    );
}
