import React, { useState, useEffect } from 'react';
import { Table, Button, Pagination,Spinner} from 'react-bootstrap';
import CustomerSupportHeader from '../../Components/Headers/CustomerSupportHeader';

export default function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const usersPerPage = 10; // Number of users per page
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [error, setError] = useState("")

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/user'); // Fetch users from backend route
                const data = await response.json();
                const filteredUsers = data.filter(user => user.position === 'user' && user.status === "Active");
                setUsers(filteredUsers); // Set the fetched users to the state
            } catch (error) {
                setError("Server Error: Please Refresh the Page")
                console.error('Error fetching users:', error);
            }finally{
                setIsLoading(false)
            }
        };

        fetchUsers();
    }, []);

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

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
          <CustomerSupportHeader />
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', backgroundColor: '#f9f9f9' }}>
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
                <>
                  <h2 style={{ color: '#6b705c' }}>User Accounts</h2>
                  <hr />
                  <Table
                    
                    className="table table-hover table-striped"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
                    }}
                  >
  <thead style={{ backgroundColor: '#a5a58d', color: '#ffffff' }}>
  <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                     
                      {currentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone.slice(0, 8)}</td>
                          <td>{new Date(user.joined).toLocaleDateString('en-GB')}</td>
                          <td>{user.status}</td>
                          <td >
                            <Button
                              variant="primary"
                              size="sm"
                              href={`/order-history/${user.name}`}
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '16px',
                                borderRadius: '5px',
                                padding: '6px 12px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              }}
                            >
                              View Orders
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
      
                  {/* Pagination */}
                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </>
      );
      
    
}
