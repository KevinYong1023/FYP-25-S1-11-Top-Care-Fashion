const express = require('express');
const router = express.Router();
const Order = require('../models/orders.js');
const Product = require('../models/product');
const authenticate = require('../middleware/authenticate');
const User = require('../models/users.js');
const mongoose = require('mongoose'); // Import mongoose

// Get all order history (Admin-only route, consider adding auth)
router.get('/order-history', async (req, res) => {
    try {
        const orders = await Order.find(); 
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Error fetching order history' });
    }
});

router.put('/update-order-status/:orderNumber', async (req, res) => {
    const { orderNumber } = req.params;
    const { sellerName, status } = req.body;

    const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await Order.findOne({ orderNumber });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the specific seller's status
        const sellerIndex = order.seller.findIndex(s => s.sellerName === sellerName);
        if (sellerIndex === -1) {
            return res.status(404).json({ message: 'Seller not found in this order' });
        }

        order.seller[sellerIndex].status = status;

        // Check if ALL sellers have status "Delivered"
        const allDelivered = order.seller.every(s => s.status === 'Delivered');

        // If all seller items are delivered, set main order status to "Completed"
        if (allDelivered) {
            order.status = 'Completed';
        }

        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Error updating order status' });
    }
});



// routes/orders.js
router.post('/create-order', authenticate, async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const { seller, total, buyerName: buyerNameFromBody } = req.body;

        let buyerUserId = req.user?.userId || req.userId;
        let buyerName;

        const totalPrice = parseFloat(total);
        console.log("Parsed Total Price:", totalPrice, typeof totalPrice);

        if (!Array.isArray(seller) || seller.length === 0) {
            return res.status(400).json({ message: 'Order seller are required and must be an array.' });
        }

        if (typeof total !== 'number' || total <= 0) {
            return res.status(400).json({ message: 'Total price must be a number greater than 0.' });
        }

        // Handle buyerUserId (if it's a valid MongoDB ObjectId)
        if (typeof buyerUserId === 'string' && mongoose.Types.ObjectId.isValid(buyerUserId)) {
            try {
                const objectIdBuyerUserId = new mongoose.Types.ObjectId(buyerUserId);
                const user = await User.findOne({ _id: objectIdBuyerUserId }).select('userId name').lean();
                console.log("User object from database:", user);

                if (user) {
                    if (user.userId) {
                        buyerUserId = user.userId;
                    } else {
                        console.error("user.userId is undefined", user);
                        return res.status(500).json({ message: 'Database error: user.userId is undefined' });
                    }

                    buyerName = user.name;
                } else {
                    return res.status(400).json({ message: 'Buyer user not found.' });
                }
            } catch (dbError) {
                console.error("Database error during ObjectId conversion:", dbError);
                return res.status(500).json({ message: 'Internal server error', error: dbError.message });
            }
        } else if (typeof buyerUserId !== 'number') {
            if (typeof buyerUserId === 'undefined') {
                return res.status(400).json({ message: 'buyerUserId is undefined. Check your authentication middleware.' });
            }
            return res.status(400).json({ message: 'Invalid buyerUserId type. Expected number or valid ObjectId string, got ' + typeof buyerUserId });
        }

        const numericBuyerUserId = buyerUserId;

        // If buyerName not found from DB, use frontend value
        if (!buyerName && buyerNameFromBody) {
            buyerName = buyerNameFromBody;
        }

        // Optional: warn if mismatch between frontend and DB name
        if (buyerName && buyerNameFromBody && buyerName !== buyerNameFromBody) {
            console.warn(`Mismatch in buyerName. Frontend sent "${buyerNameFromBody}", DB has "${buyerName}"`);
        }

        // Final fallback: fetch by numericUserId if name still missing
        if (!buyerName) {
            try {
                const user = await User.findOne({ userId: numericBuyerUserId }).select('name').lean();
                if (user && user.name) {
                    buyerName = user.name;
                } else {
                    return res.status(400).json({ message: 'Buyer name not found.' });
                }
            } catch (error) {
                console.error("Database error fetching user name:", error);
                return res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        }

        console.log("Received order seller:", seller);
        console.log("Determined buyerName:", buyerName);

        // Validate each seller item
        for (const item of seller) {
            if (!item || !item.sellerName || !item.productName) {
                console.error("Missing sellerName or productName for item:", item);
                return res.status(400).json({ message: 'Each seller item must contain sellerName and productName.' });
            }
        }
        const sellerData = seller.map(item => item);
        console.log(sellerData);
        // Create new order
        const newOrder = new Order({
            seller: seller.map(item => ({
                sellerName: item.sellerName,
                productName: item.productName,
                price: item.price
            })),
            buyerName: buyerName,
            total: totalPrice,
        });

        try {
            await newOrder.save();
            res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (saveError) {
            console.error("Error saving order:", saveError);
            return res.status(500).json({ message: 'Failed to save order', error: saveError.message });
        }

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;
