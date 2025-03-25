const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    description:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    assignee: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        required: true
    }
});

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Export the model
module.exports = Ticket;
