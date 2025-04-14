const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number, 
        unique: true,
    },
    seller: [{ // Array of product objects
        sellerName: { type: String, required: true },
        productName: { type: String, required: true },
    }],
    created: {
        type: Date,
        default: Date.now,
    },
    total: { // total price of the order
        type: Number, // Changed to Number
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], // added enum for validation.
    },
    buyerName: { // Changed to buyerName for clarity
        type: String,
        required: true,
    },
}, { timestamps: false });

// Custom auto-increment method for orderNumber (using string format)
orderSchema.statics.getNextOrderNumber = async function () {
    const lastOrder = await this.findOne().sort({ orderNumber: -1 });
    if (!lastOrder) return 1;
    return lastOrder.orderNumber + 1;
};

// Pre-save hook to set the orderNumber before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        this.orderNumber = await this.constructor.getNextOrderNumber();
    }
    next();
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;