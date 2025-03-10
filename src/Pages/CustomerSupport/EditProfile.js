import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import Sidebar from '../../Components/CustomerSupport/Sidebar';
import Header from '../../Components/CustomerSupport/Header';

export default function EditProfile(){
    return(
        <>
        {/* Universal Header */}
        <Header />

        <Container fluid>
            <Row className="d-flex">
                {/* Sidebar - fixed width, no padding */}
                <Col xs={11} md={2} id="sidebar" className="p-0" style={{ minHeight: '100vh' }}>
                    <Sidebar />
                </Col>

             {/* Main Content */}
             <Col md={10} style={{ padding: '20px' }}>
             <form>
            <label>Name:</label>
            <hr/>
            <label>Email:</label>
            <input type='text'/>
            <hr/>
            <label>Phone No.:</label>
            <input type='text'/>
            <hr/>
            <label>D.O.B:</label>
            <input type='text'/>
            <hr/>
            <input type="submit"/>
        </form>
             </Col></Row></Container></>
       
    )
}