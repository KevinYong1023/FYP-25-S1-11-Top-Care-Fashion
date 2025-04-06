const mongoose = require('mongoose');
const Ticket = require('../models/tickets'); // Adjust to your model file path

const env = 'mongodb+srv://fyp-kevin:P1023swrd@fyp.lx0gt.mongodb.net/fyp'; // MongoDB connection string

// Connect to MongoDB
mongoose.connect(env, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        const dbName = mongoose.connection.db.databaseName; // Get the database name
        console.log(`Connected to MongoDB Database: ${dbName}`);

        // Create sample test data
        const tickets = [
            { ticketId:5, orderId: 1, user: 'John Jones', description: 'Issue with product delivery', status: 'Open', assignee: '', created: new Date() },
            {  ticketId:6, orderId: 2, user: 'John Jones', description: 'Payment issue', status: 'Open', assignee: '', created: new Date() },
            { ticketId:7, orderId: 3, user: 'John Jones', description: 'Product not received', status: 'Open', assignee: '', created: new Date() },
            { ticketId:8,orderId: 4, user: 'John Jones', description: 'Wrong product delivered', status: 'Open', assignee: '', created: new Date() }
        ];

        // Insert test data into the tickets collection
        Ticket.insertMany(tickets)
            .then(result => {
                console.log(`${result.length} tickets created successfully!`);
                mongoose.disconnect(); // Disconnect from MongoDB after the operation
            })
            .catch(error => {
                console.error("Error inserting test data:", error);
                mongoose.disconnect();
            });
    })
    .catch(error => {
        console.error("MongoDB connection error:", error);
    });
