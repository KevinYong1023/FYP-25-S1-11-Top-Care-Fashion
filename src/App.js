import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProductPage from './Pages/ProductPage';
import ShopPage from './Pages/ShopPage';
import Dashboard from "./Pages/CustomerSupport/Dashboard";
import CustomerSupportProfile from "./Pages/CustomerSupport/CustomerSupportProfile";
import ViewUsers from "./Pages/CustomerSupport/ViewUsers.js";
import OrderHistory from "./Pages/CustomerSupport/OrderHistory";
import Logout from "./Pages/Logout";
import TicketInfo from "./Pages/CustomerSupport/TicketInfo";
import UploadProduct from './Pages/UploadProduct.js';
import UpdateAccount from "./Pages/UpdateAccount";
import UserProfile from "./Pages/UserProfile";
import TotalTicket from "./Pages/CustomerSupport/TotalTicket";
import ShippingDetail from "./Pages/ShippingDetail.js";
import ManageList from "./Pages/ManageList.js";
import ViewAccounts from "./Pages/Admin/ViewAccounts";
import AdminProfile from "./Pages/Admin/AdminProfile.js";
import AdminCreateAccount from "./Pages/Admin/AdminCreateAccount";
import MixMatch from "./Pages/MixMatch.js";
import ManagerDashboard from "./Pages/Manager/ManagerDashboard";
import ManagerProfile from "./Pages/Manager/ManagerProfile";
import ManagerProfileUpdate from "./Pages/Manager/ManagerProfileUpdate";
import ManagerUsersDashboard from "./Pages/Manager/ManagerUsersDashboard";
import ManagerUsersIndividual from "./Pages/Manager/ManagerUsersIndividual";
import { CartProvider } from './Components/CartContext.js';
import Cart from './Pages/Cart';
import Payment from './Pages/Payment';
import CustomerSupportProfileUpdate from "./Pages/CustomerSupport/CustomerSupportProfileUpdate.js";
import AdminProfileUpdate from "./Pages/Admin/AdminProfileUpdate.js";
import ResetPassword from "./Pages/ResetPassword.js";
import UserOrders from "./Pages/UserOrders.js";
import CreateTicket from "./Pages/CreateTicket.js";

// Create the context
export const AuthContext = createContext();

function App() {
    const [login, setLogin] = useState(false);
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [userEmail, setUserEmail] = useState(""); // For manager to check the products that link to the user

    // Load data from localStorage when the app starts
    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedRole = localStorage.getItem("role");
        const savedLogin = localStorage.getItem("login");
        const savedName = localStorage.getItem("name");
        const savedAddress = localStorage.getItem("address");
        const savedUserEmail = localStorage.getItem("userEmail");
        
        if (!sessionStorage.getItem("hasVisited")) {
            const savedLogin = localStorage.getItem("login");
            if (savedLogin !== "true") {
                localStorage.clear();
            }
            sessionStorage.setItem("hasVisited", "true");
        }

        if (savedEmail) {
            setEmail(savedEmail);
        }
        if (savedRole) {
            setRole(savedRole);
        }
        if (savedLogin === "true") {
            setLogin(true);
        }
        if (savedName) {
            setName(savedName);
        }
        if (savedAddress) {
            setAddress(savedAddress);
        }
        if (savedUserEmail) {
            setUserEmail(savedUserEmail);
        }
    }, []);

    // Save state changes to localStorage when values update
    useEffect(() => {
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        localStorage.setItem("login", login);
        localStorage.setItem("name", name);
        localStorage.setItem("address", address);
    }, [userEmail,email, role, login, name, address]);

    return ( 
        <AuthContext.Provider value={{ login, setLogin, role, setRole, email, setEmail, name, setName, address, setAddress,userEmail, setUserEmail}}>
            <CartProvider email={email}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<Home email={email}  />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setLogin={setLogin} />} />
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/productpage/:id" element={<ProductPage email={email} />} />
                        <Route path="/shoppage" element={<ShopPage loginStatus={login} email={email} />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/ticket-info/:ticketId" element={<TicketInfo email={email}/>} />
                        <Route path="/customer-support-profile" element={<CustomerSupportProfile/>} />
                        <Route path="/customer-support-profile-update" element={<CustomerSupportProfileUpdate/>}/>
                        <Route path="/view-accounts" element={<ViewUsers />} />
                        <Route path="/order-history/:name" element={<OrderHistory />} />
                        <Route path="/assigned-ticket" element={<TotalTicket email={email} />} />
                        <Route path="/logout" element={<Logout setLogin={setLogin} />} />
                        <Route path="/update-account" element={<UpdateAccount email={email} />} />
                        <Route path="/your-orders" element={<UserOrders email={email}/>}/>
                        <Route path="/create-ticket/:orderId" element={<CreateTicket email={email}/>}/>
                        <Route path="/user-profile" element={<UserProfile email={email} setName={setName} setAddress={setAddress}/>} />
                        <Route path="/upload-product" element={<UploadProduct email={email} />} />
                        <Route path="/shipping-detail" element={<ShippingDetail />} />
                        <Route path="/manage-list" element={<ManageList email={email} />} />
                        <Route path="/view-all-accounts" element={<ViewAccounts/>} />
                        <Route path="/admin-profile" element={<AdminProfile />} />
                        <Route path="/admin-profile-update" element={<AdminProfileUpdate/>} />
                        <Route path="/create-account" element={<AdminCreateAccount />} />
                        <Route path="/mixmatch" element={<MixMatch />} />
                        <Route path="/managerdashboard" element={<ManagerDashboard />} />
                        <Route path="/managerprofile" element={<ManagerProfile/>} />
                        <Route path="/managerprofileupdate" element={<ManagerProfileUpdate/>} />
                        <Route path="/managerusersdashboard" element={<ManagerUsersDashboard />} />
                        <Route path="/managerusersindividual" element={<ManagerUsersIndividual />} />
                        <Route path="/cart" element={<Cart email={email} />} />
                        <Route path="/payment" element={<Payment />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthContext.Provider>
    );
}

export default App;
