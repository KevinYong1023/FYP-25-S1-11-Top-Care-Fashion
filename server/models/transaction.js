// models/Transaction.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
    {
        orderNumber: {
            type: String, // Changed to String for flexibility
            unique: true,
        },
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
        senderName: { // Added senderName
            type: String,
            required: true 
        },
             
        receiverName:{ // Added receiverName
             type: String,
             required: true 
            }, 

        amount: {
            type: Number,
            required: true,
            min: [0.01, 'Transaction amount must be positive.']
        },
        date: {
            type: Date,
            default: Date.now,
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
        },
        
        productName: {
             type: String 
            }, // Add productName field
    
    },
    {
        timestamps: true
    }
);

transactionSchema.statics.getNextOrderNumber = async function () {
    const lastOrder = await this.findOne().sort({ orderNumber: -1 });
    if (!lastOrder) {
        return '1'; // Start from '1' as a string
    }
    const nextNumber = parseInt(lastOrder.orderNumber, 10) + 1;
    return nextNumber.toString();
};

// Pre-save hook to set the orderNumber before saving
transactionSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        this.orderNumber = await this.constructor.getNextOrderNumber();
    }
    next();
});


const Transaction = mongoose.model(
    'Transaction',
    transactionSchema,
    'transaction'
);

module.exports = Transaction;