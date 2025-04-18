const mongoose = require('mongoose');
const Counter = require('./counter'); // Import the counter model

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: Number, 
        unique: true,
    },
    seller: [{ // Array of product objects
        sellerName: { type: String, required: true },
        productName: { type: String, required: true },
        price: {
            type: Number,
            required: true
          },
        status: {
            type: String,
            required: true,
            default: 'Processing',
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], // added enum for validation.
        }
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
        enum: ['Processing', 'Completed'], // added enum for validation.
    },
    buyerName: { // Changed to buyerName for clarity
        type: String,
        required: true,
    },
}, { timestamps: false });

// Pre-save hook to set the orderNumber before saving
orderSchema.pre('save', async function (next) {
      if (this.isNew) {
        try {
          const counter = await Counter.findOneAndUpdate(
            { name: 'orderNumber' },  // Query by the 'name' field instead of _id
            { $inc: { value: 1 } }, // Increment the counter
            { new: true, upsert: true }
          );
          this.orderNumber = counter.value;  // Set orderNumber based on the counter value
        } catch (error) {
          console.error('Error auto-incrementing orderNumber from counter:', error);
          return next(error);
        }
      }
      next();
});

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

// Export the model
module.exports = Order;