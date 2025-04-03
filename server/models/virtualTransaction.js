// models/VirtualTransaction.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for logging fake money transfers
// Changed variable name to match model name convention (PascalCase)
const virtualTransactionSchema = new Schema(
  {
    // --- Reference to the Sender ---
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Links to the User who sent the fake money
      required: true,
      index: true // Index for efficient querying of a user's outgoing transactions
    },

    // --- Reference to the Receiver ---
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Links to the User who received the fake money
      required: true,
      index: true // Index for efficient querying of a user's incoming transactions
    },

    // --- Amount Transferred ---
    amount: {
      type: Number, // The amount of fake currency transferred
      required: true,
      min: [0.01, 'Transaction amount must be positive.'] // Or 1 if using whole units
    },

    // --- Status of the Logged Transaction ---
    status: {
      // Since internal transfers are atomic (succeed or fail completely),
      // we typically only log successful transfers.
      type: String,
      required: true,
      enum: ['completed'], // Only log completed transfers
      default: 'completed' // Default to completed when logged
    },

    // --- Optional Description/Memo ---
    description: {
      type: String,
      trim: true, // Remove leading/trailing whitespace
      required: false // Make it optional
    }
  },
  {
    // --- CORRECTED Timestamps Option ---
    // Use 'timestamps: true' (plural) to get both createdAt and updatedAt
    timestamps: true
    // --- END CORRECTION ---
  }
);

// Optional: Compound index for querying transactions between two specific users
// virtualTransactionSchema.index({ senderId: 1, receiverId: 1 });

// Create and export the Mongoose model
// --- EDIT: Explicitly specify the collection name as the third argument ---
const VirtualTransaction = mongoose.model(
    'VirtualTransaction',           // 1st arg: Model name (used in refs)
    virtualTransactionSchema,       // 2nd arg: Schema definition
    'virtualTransaction'            // 3rd arg: Explicit collection name (singular, as you specified)
);
// --- END EDIT ---


module.exports = VirtualTransaction;