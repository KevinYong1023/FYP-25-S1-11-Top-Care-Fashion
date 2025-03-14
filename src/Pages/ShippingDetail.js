import React from 'react';  
import { Container, Button, Form } from 'react-bootstrap';  
import UserHeader from '../Components/Headers/userHeader';  
import '../css/ShippingDetail.css'; // Ensure to create this CSS file for styling  

const ShippingDetail = ({ loginStatus }) => {  
    console.log(loginStatus); // Simulate login status  

    return (  
        <div>  
            <UserHeader loginStatus={loginStatus} /> {/* Pass the login status */}  
            <Container className="shipping-container">  
                <h2>Shipping Details</h2>  
                <Form className="shipping-form">  
                    <div className="input-group">  
                        <Form.Control type="text" placeholder="First Name" required />  
                        <Form.Control type="text" placeholder="Last Name" required />  
                    </div>  
                    <div className="input-group">  
                        <Form.Control type="email" placeholder="Email" required />  
                        <Form.Control type="text" placeholder="Country" required />  
                    </div>  
                    <div className="address-inputs">  {/* Wrap address and apartment in a div */}  
                        <Form.Control type="text" placeholder="Address" required />  
                        <Form.Control type="text" placeholder="Apartment, suite, etc. (optional)" />  
                    </div>  
                    <div className="input-group">  
                        <Form.Control type="text" placeholder="Postal Code" required />  
                        <Form.Control type="tel" placeholder="Phone No." required />  
                    </div>  
                    <Button type="submit" className="submit-button">Save</Button>  
                </Form>  
            </Container>  
        </div>  
    );  
};  

export default ShippingDetail;  