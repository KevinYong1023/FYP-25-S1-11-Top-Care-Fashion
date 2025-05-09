import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card,Spinner} from "react-bootstrap";
import ManagerHeader from "../../Components/Headers/ManagerHeader"; 

export default function ManagerDashboard() {
        const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [dashboardData, setDashboardData] = useState({
        totalUsers: 0,
        active: 0,
        suspense: 0,
        popularCategories: "", 
        totalProducts: 0,
        categoryCounts: {
            Footwear: 0,
            Top: 0,
            Bottom: 0
        }
    });

    // Fetch users from backend and update dashboard data
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/user");
                const users = await response.json();
                const filteredUsers = users.filter(user => user.position === "user");
            
                const totalUsers = filteredUsers.length;
                // Count active users (assuming 'status' field contains "Active")
                const activeNow = filteredUsers.filter(user => user.status === "Active" && user.position === "user").length;
                const suspensedNow = filteredUsers.filter(user => user.status === "Suspended" && user.position === "user").length;
                setDashboardData(prevData => ({
                    ...prevData,
                    totalUsers,
                    active: activeNow,   // Use 'active' here
                    suspense: suspensedNow  // Use 'suspense' here
                }));
            } catch (error) {
                setError("Server Error: Please Refresh the Page")
                console.error("Error fetching users:", error);
            }finally{
                setIsLoading(false)
            }
        };

        const fetchProductInsights = async () => {
            try {
                setIsLoading(true)
                const response = await fetch("/api/products");
                const data = await response.json();
        
                // Initialize counts
                let totalProducts = 0;
                let categoryCounts = {
                    Footwear: 0,
                    Top: 0,
                    Bottom: 0
                };
        
                // Count total products and products per category
                data.forEach(product => {
                    totalProducts += 1;
        
                    if (product.category === "Footwear") {
                        categoryCounts.Footwear += 1;
                    } else if (product.category === "Top") {
                        categoryCounts.Top += 1;
                    } else if (product.category === "Bottom") {
                        categoryCounts.Bottom += 1;
                    }
                });
        
                // Update dashboard data
                setDashboardData(prevData => ({
                    ...prevData,
                    totalProducts: totalProducts,
                    categoryCounts: categoryCounts
                }));
            } catch (error) {
                setError("Server Error: Please Refresh the Page")
                console.error("Error fetching product insights:", error);
            }finally{
                setIsLoading(false)
            }
        };
        fetchUsers();
        fetchProductInsights();
    }, []); 

    return (
      <>
        <ManagerHeader />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Main Dashboard Content */}
          <div style={{ flex: 1, padding: '40px', backgroundColor: '#f0efeb' }}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
    
            {isLoading ? (
              <div className="text-center mt-5">
                <Spinner animation="border" role="status" variant="primary" />
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  padding: '30px',
                }}
              >
                <h2 className="mb-3" style={{ color: '#6e4f37'}}>Website Insights</h2>
                <hr />
    
                {/* Users Section */}
                <h3 className="mt-4">Users:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <Card
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <h5 style={{fontWeight: 'bold'}}>Total Users</h5>
                      <p>{dashboardData.totalUsers}</p>
                    </Card>
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <Card
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <h5 style={{fontWeight: 'bold'}}>Active Now</h5>
                      <p>{dashboardData.active}</p>
                    </Card>
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <Card
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <h5 style={{fontWeight: 'bold'}}>Suspended Now</h5>
                      <p>{dashboardData.suspense}</p>
                    </Card>
                  </div>
                </div>
    
                <hr />
    
                {/* Products Section */}
                <h3 className="mt-4">Products:</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: '1 1 300px' }}>
                    <Card
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <h5 style={{fontWeight: 'bold'}}>Total Products</h5>
                      <p>{dashboardData.totalProducts}</p>
                    </Card>
                  </div>
                  <div style={{ flex: '1 1 300px' }}>
                    <Card
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <h5 style={{fontWeight: 'bold'}}>By Categories</h5>
                      <ul className="mb-0">
                        <li>Footwear: {dashboardData.categoryCounts.Footwear}</li>
                        <li>Top: {dashboardData.categoryCounts.Top}</li>
                        <li>Bottom: {dashboardData.categoryCounts.Bottom}</li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
     
}
