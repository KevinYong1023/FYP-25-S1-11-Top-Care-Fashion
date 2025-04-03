const express = require('express');
const router = express.Router();
const Orders = require('../models/orders');


// API to get order history by username
router.get('/order-history', async (req, res) => {    
    try {
        const orders = await Orders.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Error fetching order history' });
    }
});

// API to get order history by username
router.get('/order-history/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        const orders = await Orders.find({ user: username });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Error fetching order history' });
    }
});

// API to get order details by order ID (_id)
router.get('/order-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Orders.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Error fetching order details' });
    }
});


// Route to get a specific order by invoice ID (_id)
router.get('/api/order-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find order by _id (MongoDB ObjectId)
        const order = await Orders.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/update-order-status/:id', async (req, res) => {
    const { id } = req.params; // Get the order ID from the URL parameter
    const { status } = req.body; // Get the new status from the request body

    // Validate that the status is one of the allowed values
    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        // Find the order by ID and update the status
        const order = await Orders.findByIdAndUpdate(
            id,
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

//Create a new order
router.post('/create-order', async (req, res) => {
    const { seller, purchased, total, product, user } = req.body;

    // Validate the request body
    if (!seller || !purchased || !total || !product || !user) {
        return res.status(400).json({ message: 'All field are required' });
    }

    try {
        // Create a new order object
        const newOrder = new Orders({
            seller,
            purchased,
            total,
            product,
            user,
            status: 'Processing',  // Default status is Processing
        });

        // Save the new order to the database
        await newOrder.save();

        // Return the newly created order
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error while creating the order' });
    }
});

module.exports = router;
