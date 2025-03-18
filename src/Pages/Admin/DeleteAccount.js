import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import AdminSidebar from '../../Components/Sidebars/AdminSidebar';
import userData from '../../mockdata/users.json'; // Adjust the path to your actual json file

export default function DeleteAccount() {

    // A use state to update the page from deleted
    const [deletedUserIds, setDeletedUserIds] = useState([]);

    // Get the user table
    const filteredUsers = userData.filter(user => user.position);

    // State to store the search query
    const [searchQuery, setSearchQuery] = useState('');

    // Function to handle search input changes
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    // Function to filter users based on search query
    const filteredUsersBySearch = filteredUsers.filter((user) => {
        return (
            !deletedUserIds.includes(user.id) && 
            (user.id.toString().toLowerCase().includes(searchQuery) ||
            user.name.toLowerCase().includes(searchQuery) ||
            user.position.toLowerCase().includes(searchQuery))
        );
    });

    // Use state on checkbox
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleCheckboxChange = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
        );
    };

    const handleDelete = () => {
        if (selectedUsers.length === 0) {
            alert('No users selected');
            return;
        }
    
    
        setDeletedUserIds(prev => [...prev, ...selectedUsers]);

        const deletedUsers = filteredUsers.filter(user => selectedUsers.includes(user.id));
        const deletedInfo = deletedUsers.map(user => `User Deleted:\nID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\n`).join("\n");

        // Create a Blob and trigger download since react cannot output file directly
        const blob = new Blob([deletedInfo], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "deleted_users.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`Users deleted: ${selectedUsers.join(", ")}`);
    
        setSelectedUsers([])
    };

    return (
        <>
            <Container fluid>
                <Row className="d-flex">
                    {/* Sidebar */}
                    <Col xs={11} md={2} id="AdminSidebar" className="p-0" style={{ minHeight: '100vh' }}>
                        <AdminSidebar />
                    </Col>
                   
                    {/* Main Content */}
                    <Col md={10 } style={{ padding: '20px' }}>
                        <button 
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                right: '20px',
                                backgroundColor: 'red',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                            onClick={handleDelete}>
                            Delete Account
                        </button>

                        <div>
                            Search: <input type='text' onChange={handleSearchChange} value={searchQuery} />
                        </div>
                        <br/>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Account ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Select to delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsersBySearch.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone.slice(0, 8)}</td> {/* Limits phone to 8 characters */}
                                        <td>{user.position}</td>
                                        <td>
                                           <Form.Check
                                               type='checkbox'
                                               id={user.id}
                                               checked={selectedUsers.includes(user.id)}
                                               onChange={() => handleCheckboxChange(user.id)}>
                                           </Form.Check>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        </>
    );
}