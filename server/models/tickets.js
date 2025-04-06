const mongoose = require('mongoose');

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: Number,
        unique: true,  // Ensure the ticketNumber is unique
    },
    orderId: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    description: {
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
        default: ""
    },
    created: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to set auto-increment ticketId
ticketSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastTicket = await Ticket.findOne().sort({ ticketId: -1 });
            this.ticketId = lastTicket ? lastTicket.ticketId + 1 : 1; // Start from 1 if no tickets exist
        } catch (error) {
            console.error('Error auto-incrementing ticketId:', error);
        }
    }
    next();
});

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

// Export the model
module.exports = Ticket;