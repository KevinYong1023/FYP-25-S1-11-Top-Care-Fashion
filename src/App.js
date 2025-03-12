import React, { useState, useEffect, createContext } from "react";
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
import Chatbox from "./Pages/CustomerSupport/Chatbox";
import OrderDetails from "./Pages/CustomerSupport/OrderDetails";
import TotalTicket from "./Pages/CustomerSupport/TotalTicket";

// Create the context
export const AuthContext = createContext();

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    // Load data from localStorage when the app starts
    useEffect(() => {
        const savedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const savedRole = localStorage.getItem("role");
        const savedEmail = localStorage.getItem("email");

        if (savedIsLoggedIn) {
            setIsLoggedIn(true);
            setRole(savedRole);
            setEmail(savedEmail);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, email, setEmail,name, setName }}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/productpage" element={<ProductPage />} />
                    <Route path="/shoppage" element={<ShopPage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ticket-info/:id" element={<TicketInfo />} />
                    <Route path="/profile" element={<Profile email={email} setName={setName}/>} />  {/* Passing email as prop */}
                    <Route path="/view-accounts" element={<ViewUsers />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/chatbox" element={<Chatbox />} />
                    <Route path="/order-details/:inv" element={<OrderDetails />} />
                    <Route path="/ticket-delete" element={<TicketDelete />} />
                    <Route path = "/assigned-ticket" element={<TotalTicket name={name}/>}/>
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />  {/* Pass setIsLoggedIn to Logout */}
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
