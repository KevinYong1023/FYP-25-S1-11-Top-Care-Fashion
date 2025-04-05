const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Define the orderHistory schema
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,  // Ensure the ticketNumber is unique
    },
    seller:{ // User sell the product: Product A: User1, Product B: User2 
        type:Array, 
        required:true
    },
    created: {
        type: Date,
        default: Date.now
    },
    products:{
        type:String,
        required:true
    },
    total:{ // Total Price 
        type: String,
        required:true
    },
    status: {
        type: String,
        required: true,
        default: "Processing"
    },
    buyer:{ // User buy the product
        type:String,
        required:true
    }
});

// Add auto-increment to the ticketNumber field
orderSchema.plugin(AutoIncrement, {inc_field: 'orderNumber'});

// Create the Ticket model
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;
