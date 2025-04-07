// models/Transaction.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        senderId: {
            type: Number, // Change to Number
            required: true,
            index: true
        },
        receiverId: {
            type: Number, // Change to Number
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, 'Transaction amount must be positive.']
        },
        status: {
            type: String,
            required: true,
            enum: ['completed'],
            default: 'completed'
        },
        description: {
            type: String,
            trim: true,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Transaction = mongoose.model(
    'Transaction',
    transactionSchema,
    'transaction'
);

module.exports = Transaction;