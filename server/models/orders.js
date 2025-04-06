const mongoose = require('mongoose');

// Define the orderHistory schema
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number,
        unique: true,  // Ensure the orderNumber is unique
    },
    seller: {  // User sells the product
        type: Array,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    products: {
        type: String,
        required: true
    },
    total: { // Total Price
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Processing"
    },
    buyer: {  // User buys the product
        type: String,
        required: true
    }
});

// Custom auto-increment method for orderNumber
orderSchema.statics.getNextOrderNumber = async function() {
    const lastOrder = await this.findOne().sort({ orderNumber: -1 });  // Get the last order
    if (!lastOrder) {
        return 1;  // If no orders exist, start from 1
    }
    return lastOrder.orderNumber + 1;  // Increment the last order number
};

// Pre-save hook to set the orderNumber before saving
orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        this.orderNumber = await this.constructor.getNextOrderNumber();  // Get the next order number
    }
    next();
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;
