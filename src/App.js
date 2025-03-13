import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProductPage from './Pages/ProductPage';
import ShopPage from './Pages/ShopPage';
import Dashboard from "./Pages/CustomerSupport/Dashboard";
import CustomerSupportProfile from "./Pages/CustomerSupport/CustomerSupportProfile";
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
    const [login, setLogin] = useState(false)
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    // Load data from localStorage when the app starts
    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        setEmail(savedEmail);
    }, []);

    return (
        <AuthContext.Provider value={{login, setLogin,role, setRole,email, setEmail,name, setName }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setLogin={setLogin}/>} />
                    <Route path="/productpage" element={<ProductPage />} />
                    <Route path="/shoppage" element={<ShopPage loginStatus={login}/>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ticket-info/:id" element={<TicketInfo />} />
                    <Route path="/customer-support-profile" element={<CustomerSupportProfile email={email} setName={setName}/>} /> 
                    <Route path="/view-accounts" element={<ViewUsers />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/chatbox" element={<Chatbox />} />
                    <Route path="/order-details/:inv" element={<OrderDetails />} />
                    <Route path="/ticket-delete" element={<TicketDelete />} />
                    <Route path = "/assigned-ticket" element={<TotalTicket name={name}/>}/>
                    <Route path="/logout" element={<Logout setLogin={setLogin}/>} /> 
                </Routes>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
