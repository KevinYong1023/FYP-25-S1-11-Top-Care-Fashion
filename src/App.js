import React from "react";  
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";  
import Home from "./Pages/Home";      
import Register from "./Pages/Register";  
import Login from "./Pages/Login";  
import ProductPage from './Pages/ProductPage';   
import ShopPage from './Pages/ShopPage'; // Import ShopPage  
import Header from "./Components/Header"; // ✅ Import Header Component  
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Ensure Bootstrap is loaded  

function App() {  
    return (  
        <Router>  
            <Header />  {/* ✅ Header will appear on all pages */}  
            <Routes>  
                <Route path="/" element={<Home />} />   
                <Route path="/register" element={<Register />} />   
                <Route path="/login" element={<Login />} />   
                <Route path="/productpage" element={<ProductPage />} /> {/* Corrected here */}  
                <Route path="/shoppage" element={<ShopPage />} /> {/* New route for ShopPage */}  
            </Routes>  
        </Router>  
    );  
}  

export default App;  