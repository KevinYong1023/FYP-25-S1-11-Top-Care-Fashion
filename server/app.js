// Setup Basic Express Server
// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('./routes/routers'); // Import the route

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

// Basic route to test if the server is running
app.get('/', (req, res) => {
  res.send('API is running');
});

// Use the login route for handling login requests
app.use('/api', route);  // Use this route under '/api'

// Define the port the server will listen on (from .env or default to 5000)
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
