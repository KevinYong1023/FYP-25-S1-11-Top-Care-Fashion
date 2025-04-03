const express = require('express');
const router = express.Router();
const Orders = require('../models/orders');

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

module.exports = router;
