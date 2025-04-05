// models/Transaction.js // <-- RENAMED FILE

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for logging money transfers
// --- RENAMED schema variable ---
const transactionSchema = new Schema(
  {
    // --- Reference to the Sender ---
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Links to the User who sent the money
      required: true,
      index: true
    },

    // --- Reference to the Receiver ---
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Links to the User who received the money
      required: true,
      index: true
    },

    // --- Amount Transferred ---
    amount: {
      type: Number, // The amount of currency transferred
      required: true,
      min: [0.01, 'Transaction amount must be positive.']
    },

    // --- Status of the Logged Transaction ---
    status: {
      type: String,
      required: true,
      enum: ['completed'], // Current assumption: only log completed
      default: 'completed'
    },

    // --- Optional Description/Memo ---
    description: {
      type: String,
      trim: true,
      required: false
    }
  },
  {
    timestamps: true // Keeps createdAt and updatedAt
  }
);

// Optional: Compound index for querying transactions between two specific users
// transactionSchema.index({ senderId: 1, receiverId: 1 });

// Create and export the Mongoose model
// --- RENAMED Model name, Schema variable, and Collection name ---
const Transaction = mongoose.model(
    'Transaction',          // 1st arg: Model name (PascalCase)
    transactionSchema,      // 2nd arg: Schema definition
    'transaction'           // 3rd arg: Explicit collection name (singular lowercase)
);

// --- RENAMED Export variable ---
module.exports = Transaction;