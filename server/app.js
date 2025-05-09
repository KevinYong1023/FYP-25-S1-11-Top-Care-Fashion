// Setup Basic Express Server

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require("path");


// Import the API-related routes
const paymentsRoutes = require('./routes/payments.js');
const userRoutes = require('./routes/users'); // Import the user-related routes
const ticketRoutes = require('./routes/tickets'); 
const orderRoutes = require('./routes/orders'); 
const productRoutes = require('./routes/products'); 
const commentsRoutes = require('./routes/comments')


// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Use JSON middleware to parse incoming requests
app.use(express.json());

// Use CORS middleware to allow cross-origin requests from your React frontend
app.use(cors());

// MongoDB connection string from .env or default to localhost
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/fyp';

// Connect to MongoDB using Mongoose with improved error handling
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message); // Log error message
    process.exit(1); // Exit process with failure
  });

// Use all the routes

// Use '/api/users' for all user-related routes
app.use('/api', userRoutes);
app.use('/api/auth', require('./routes/auth'));

// Use '/api/tickets' for all ticket-related routes
app.use('/api', ticketRoutes);

// Use '/api/orders' for all order-related routes
app.use('/api', orderRoutes);

app.use('/api', productRoutes);
// Use '/api/products' for all product-related routes

// Use '/api/comments' for all product-related routes
app.use('/api', commentsRoutes);

// Use '/api/virtual' for all transactions-related routes
app.use('/api/virtual', paymentsRoutes);

app.use(express.static(path.join(__dirname, "../build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});



// Define the port the server will listen on (from .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
