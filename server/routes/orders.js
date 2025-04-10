const express = require('express');
const router = express.Router();
const Orders = require('../models/orders');
const Product = require('../models/product');
const User = require('../models/users');
const authenticate = require('../middleware/authenticate');          // Ensure path is correct

// Get all order history
router.get('/order-history', async (req, res) => {
    try {
        const orders = await Orders.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Error fetching order history' });
    }
});

// Update order status by orderNumber
router.put('/update-order-status/:orderNumber', async (req, res) => {
    const { orderNumber } = req.params;  // Get the order number from the URL parameter
    const { status } = req.body;  // Get the new status from the request body

    // Validate that the status is one of the allowed values
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Find the order by orderNumber and update the status
        const order = await Orders.findOneAndUpdate(
            { orderNumber }, // Use orderNumber to find the order
            { status },
            { new: true } // Return the updated order
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Error updating order status' });
    }
});

router.post('/create-order', authenticate, async (req, res) => {
    const { cartItems, total } = req.body;
    const buyerName = req.name; // Get the user name from the token

    try {
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !total) {
            return res.status(400).json({ message: 'Invalid order data.' });
        }

        // Prepare arrays to store seller names and product names with quantities
        const orderItems = [];

        for (const item of cartItems) {
            // we are assuming that the front end sends the sellerName.
            const product = await Product.findOne({ _id: item.productId }).select('name').lean();

            if (!product) {
                return res.status(404).json({ message: 'Product not found.' });
            }

            orderItems.push({
                sellerName: item.sellerName, // Assuming sellerName is provided by the frontend
                productName: product.name,
                quantity: item.quantity,
            });
        }

        // Create the order
        const order = new Orders({
            items: orderItems,
            total: total,
            buyerName: buyerName,
        });

        await order.save();

        res.status(200).json({
            message: 'Order created successfully!',
            orderDetails: {
                items: orderItems,
                total: total,
                buyerName: buyerName,
            },
        });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(400).json({ message: `Order creation failed: ${error.message}` });
    }
});




module.exports = router;
