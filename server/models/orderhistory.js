const mongoose = require('mongoose');

// Define the orderHistory schema
const orderHistorySchema = new mongoose.Schema({
    seller:{
        type:String,
        required:true
    },
    purchased:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    user:{
        type:String,
        required:true
    }
});

// Create the Ticket model
const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

// Export the model
module.exports = OrderHistory;
