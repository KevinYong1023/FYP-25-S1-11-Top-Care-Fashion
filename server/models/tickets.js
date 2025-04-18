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
    if (this.isNew) {
      try {
        const counter = await Counter.findOneAndUpdate(
          { name: 'ticketId' },  // Query by the 'name' field instead of _id
          { $inc: { value: 1 } }, // Increment the counter
          { new: true, upsert: true }
        );
        this.ticketId = counter.value;  // Set ticketId based on the counter value
      } catch (error) {
        console.error('Error auto-incrementing ticketId from counter:', error);
        return next(error);
      }
    }
    next();
  });
  

// Create the Ticket model
const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
