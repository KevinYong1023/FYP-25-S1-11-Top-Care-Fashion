const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: Number,
        unique: true,  // Ensure the ticketNumber is unique
    },
    orderId:{
        type: Number,
        required:true
    },
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
        default: "Open"
    },
    assignee: {
        type: String,
        required: false,
        default:""
    },
    created: {
        type: Date,
        default: Date.now
      }
});

// Add auto-increment to the ticketNumber field
ticketSchema.plugin(AutoIncrement, {inc_field: 'ticketId'});

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Export the model
module.exports = Ticket;