const mongoose = require('mongoose');
const Counter = require('./counter'); // Make sure path is correct

// Define the ticket schema
const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: Number,
        unique: true,  // Ensure the ticketId is unique
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

// Pre-save hook to set auto-increment ticketId using Counter
ticketSchema.pre('save', async function (next) {
    if (this.isNew && !this.ticketId) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'ticket' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            this.ticketId = counter.value;
            next();
        } catch (error) {
            console.error('Error auto-incrementing ticketId:', error);
            next(error);
        }
    } else {
        next();
    }
});

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
