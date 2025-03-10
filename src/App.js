import React, { useEffect, useState } from "react";  
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  
import "bootstrap/dist/css/bootstrap.min.css";  

import Home from "./Pages/Home";      
import Register from "./Pages/Register";  
import Login from "./Pages/Login";  
import ProductPage from './Pages/ProductPage';   
import ShopPage from './Pages/ShopPage'; 
import Header from "./Components/Header"; 
import Dashboard from "./Pages/CustomerSupport/Dashboard";
import Profile from "./Pages/CustomerSupport/Profile";
import ViewUsers from "./Pages/CustomerSupport/ViewUsers";
import OrderHistory from "./Pages/CustomerSupport/OrderHistory";
import Logout from "./Pages/Logout";
import TicketInfo from "./Pages/CustomerSupport/TicketInfo";
import TicketDelete from "./Pages/CustomerSupport/TicketDelete";
import EditProfile from "./Pages/CustomerSupport/EditProfile";

function App() {  
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to manage login status
    const [role, setRole] = useState("user");
    return (  
      <>
        <Router>
        <Header isLoggedIn={isLoggedIn} LoggedAs={role} />

          <Routes>
            <Route path="/" element={<Home />} />   
            <Route path="/register" element={<Register />}/>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setRole={setRole}/>} />  {/* Pass setIsLoggedIn to Login */}
            <Route path="/productpage" element={<ProductPage />}/>
            <Route path="/shoppage" element={<ShopPage />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/ticket-info"  element={<TicketInfo />} /> 
            <Route path="/ticket-deleted"  element={<TicketDelete />} /> 
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/profile-update" element={<EditProfile />} /> 
            <Route path="/view-accounts" element={<ViewUsers />} /> 
            <Route path="/order-history" element={<OrderHistory />} /> 
            <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />  {/* Pass setIsLoggedIn to Logout */}
          </Routes>
        </Router>
        </>
    )
}  

export default App;
