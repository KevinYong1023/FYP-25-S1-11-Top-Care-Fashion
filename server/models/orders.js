const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Define the orderHistory schema
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,  // Ensure the ticketNumber is unique
    },
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

// Add auto-increment to the ticketNumber field
orderSchema.plugin(AutoIncrement, {inc_field: 'productId'});

// Create the Ticket model
const Order = mongoose.model('OrderHistory', orderSchema);

// Export the model
module.exports = Order;
