import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Register from "./Pages/Register"; // ✅ Import Register Page
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Top Care Fashion</h1>
                    <p>Welcome to our fashion store!</p>

                    {/* Navigation Link */}
                    <Link to="/register">
                        <button>Register</button>
                    </Link>
                </header>

                {/* Define Routes */}
                <Routes>
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
