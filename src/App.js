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
import ViewUsers from "./Pages/CustomerSupport/ViewUsers";
import OrderHistory from "./Pages/CustomerSupport/OrderHistory";
import Logout from "./Pages/Logout";
import TicketInfo from "./Pages/CustomerSupport/TicketInfo";
import CreateUser from "./Pages/CustomerSupport/CreateUser";
import UploadProduct from './Pages/UploadProduct.js';
import UpdateAccount from "./Pages/UpdateAccount";
import UserProfile from "./Pages/UserProfile";
import Chatbox from "./Pages/CustomerSupport/Chatbox";
import OrderDetails from "./Pages/CustomerSupport/OrderDetails";
import TotalTicket from "./Pages/CustomerSupport/TotalTicket";
import ShippingDetail from "./Pages/ShippingDetail.js";
import ManageList from "./Pages/ManageList.js";
import ProfitPage from "./Pages/ProfitPage.js";
import ViewAccounts from "./Pages/Admin/ViewAccounts";
import ViewAccountsAdmin from "./Pages/Admin/ViewAccountsAdmin";
import ViewAccountsManager from "./Pages/Admin/ViewAccountsManager";
import ViewAccountsUser from "./Pages/Admin/ViewAccountsUser";
import ViewAccountsCS from "./Pages/Admin/ViewAccountsCS";
import AdminProfile from "./Pages/Admin/AdminProfile.js";
import CreateAccount from "./Pages/Admin/CreateAccount.js";
import DeleteAccount from "./Pages/Admin/DeleteAccount.js";
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

// Create the context
export const AuthContext = createContext();

function App() {
    const [login, setLogin] = useState(false);
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    // Load data from localStorage when the app starts
    useEffect(() => {
        const savedEmail = localStorage.getItem("email");
        const savedRole = localStorage.getItem("role");
        const savedLogin = localStorage.getItem("login");
        const savedName = localStorage.getItem("name");

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
    }, []);

    // Save state changes to localStorage when values update
    useEffect(() => {
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        localStorage.setItem("login", login);
        localStorage.setItem("name", name);
    }, [email, role, login, name]);

    return (
        <CartProvider>
            <AuthContext.Provider value={{ login, setLogin, role, setRole, email, setEmail, name, setName }}>
                <Router>
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login setLogin={setLogin} />} />
                        <Route path="/productpage" element={<ProductPage />} />
                        <Route path="/shoppage" element={<ShopPage loginStatus={login} />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/ticket-info/:id" element={<TicketInfo email={email}/>} />
                        <Route path="/customer-support-profile" element={<CustomerSupportProfile email={email} setName={setName} />} />
                        <Route path="/customer-support-profile-update" element={<CustomerSupportProfileUpdate email={email} />} />
                        <Route path="/view-accounts" element={<ViewUsers />} />
                        <Route path="/order-history/:username" element={<OrderHistory />} />
                        <Route path="/chatbox" element={<Chatbox />} />
                        <Route path="/order-details/:id/:username" element={<OrderDetails />} />
                        <Route path="/assigned-ticket" element={<TotalTicket email={email} />} />
                        <Route path="/logout" element={<Logout setLogin={setLogin} />} />
                        <Route path="/update-account" element={<UpdateAccount />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                        <Route path="/upload-product" element={<UploadProduct />} />
                        <Route path="/shipping-detail" element={<ShippingDetail />} />
                        <Route path="/manage-list" element={<ManageList />} />
                        <Route path="/profit-page" element={<ProfitPage />} />
                        <Route path="/view-all-accounts" element={<ViewAccounts />} />
                        <Route path="/view-all-accounts-admin" element={<ViewAccountsAdmin />} />
                        <Route path="/view-all-accounts-customersupport" element={<ViewAccountsCS />} />
                        <Route path="/view-all-accounts-manager" element={<ViewAccountsManager />} />
                        <Route path="/view-all-accounts-user" element={<ViewAccountsUser />} />
                        <Route path="/admin-profile" element={<AdminProfile />} />
                        <Route path="/create-account" element={<CreateAccount />} />
                        <Route path="/delete-account" element={<DeleteAccount />} />
                        <Route path="/mixmatch" element={<MixMatch />} />
                        <Route path="/managerdashboard" element={<ManagerDashboard />} />
                        <Route path="/managerprofile" element={<ManagerProfile />} />
                        <Route path="/managerprofileupdate" element={<ManagerProfileUpdate />} />
                        <Route path="/managerusersdashboard" element={<ManagerUsersDashboard />} />
                        <Route path="/managerusersindividual/:id" element={<ManagerUsersIndividual />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/createuser" element={<CreateUser />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </CartProvider>
    );
}

export default App;
