/// server/routes/payments.js (Edited: No Sender/Buyer Deduction, No Quantity)

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const User = require('../models/users.js');
const transaction = require('../models/transaction.js');

function getNumericUserId(userId) {
    const numericUserId = typeof userId === 'number' ? userId : parseInt(userId, 10);
    if (isNaN(numericUserId)) {
        console.error("Invalid userId (not a number):", userId);
        return null;
    }
    return numericUserId;
}

// --- Route 1: Direct User-to-User Transfer (Sender revenue NOT deducted) ---
router.post('/transfer', authenticate, async (req, res) => {
    const { recipientEmail, amount, description } = req.body;
    const senderUserId = req.numericUserId;

    if (!recipientEmail || !amount) return res.status(400).json({ message: 'Recipient email and amount required.' });
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) return res.status(400).json({ message: 'Invalid amount.' });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const senderUser = await User.findById(senderUserId).select('_id').lean().session(session);
        if (!senderUser) throw new Error('Sender user not found.');

        const recipientUser = await User.findOne({ email: recipientEmail }).select('_id position').session(session);
        if (!recipientUser) throw new Error('Recipient user not found.');
        if (recipientUser.position !== 'user') throw new Error('Recipient user cannot receive virtual currency.');
        const recipientUserId = recipientUser._id;

        if (senderUserId.toString() === recipientUserId.toString()) {
            throw new Error('Cannot send virtual currency to yourself.');
        }

        const receiverUpdateResult = await User.updateOne(
            { _id: recipientUserId },
            { $inc: { revenue: transferAmount } }
        ).session(session);

        if (receiverUpdateResult.modifiedCount === 0) {
            throw new Error('Failed to credit receiver revenue.');
        }

        const transactionLog = new transaction({
            senderId: senderUserId,
            receiverId: recipientUserId,
            senderName: senderUser.name,
            receiverName: recipientUser.name,
            amount: transferAmount,
            description: description,
            status: 'completed'
        });
        await transactionLog.save({ session });

        await session.commitTransaction();

        const currentSenderData = await User.findById(senderUserId).select('revenue');

        res.status(200).json({
            message: 'Virtual currency transfer successful! (Sender revenue not deducted)',
            transactionId: transactionLog._id,
            newRevenue: currentSenderData ? currentSenderData.revenue : null
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Virtual Transfer Failed:', error);
        res.status(400).json({ message: `Transfer failed: ${error.message}` });
    } finally {
        session.endSession();
    }
});

// --- Route 2: Cart Checkout (Buyer Revenue NOT deducted, No Quantity) ---
router.post('/checkout', authenticate, async (req, res) => {
    const { cartItems } = req.body;
    let buyerUserId = req.userId;

    if (typeof buyerUserId === 'string' && mongoose.Types.ObjectId.isValid(buyerUserId)) {
        try {
            const user = await User.findOne({ _id: buyerUserId }).select('userId');
            if (user) {
                buyerUserId = user.userId;
            } else {
                return res.status(400).json({ message: 'Buyer user not found.' });
            }
        } catch (dbError) {
            console.error("Database error during ObjectId conversion:", dbError);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else if (typeof buyerUserId !== 'number') {
        return res.status(400).json({ message: 'Invalid buyerUserId type.' });
    }

    const numericBuyerUserId = buyerUserId;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart invalid.' });
    }

    let totalAmount = 0;
    const sellerPayouts = new Map();

    try {
        cartItems.forEach(item => {
            const price = parseFloat(item.price);
            const sellerId = item.sellerId;

            if (isNaN(price) || price <= 0 || !sellerId) {
                throw new Error(`Invalid cart item`);
            }

            totalAmount += price;
            sellerPayouts.set(sellerId, (sellerPayouts.get(sellerId) || 0) + price);
        });

        totalAmount = Math.round(totalAmount * 100) / 100;

        if (totalAmount <= 0) {
            throw new Error('Total must be positive.');
        }
    } catch (validationError) {
        return res.status(400).json({ message: `Invalid cart data: ${validationError.message}` });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const buyerUser = await User.findOne({ userId: numericBuyerUserId }).select('userId name').lean().session(session);
        if (!buyerUser) {
            throw new Error('Buyer user not found.');
        }

        const sellerUpdatePromises = [];
        let transactionLogs = [];

        for (const [sellerId, payoutAmount] of sellerPayouts.entries()) {
            if (numericBuyerUserId !== sellerId) {
                const sellerUser = await User.findOne({ userId: sellerId }).select('name').lean().session(session);
                if (!sellerUser) {
                    throw new Error(`Seller ${sellerId} not found.`);
                }

                const cartItem = cartItems.find(item => item.sellerId === sellerId);
                const productName = cartItem ? cartItem.productName : null;

                const updatePromise = User.updateOne(
                    { userId: sellerId },
                    { $inc: { revenue: payoutAmount } }
                ).session(session);
                sellerUpdatePromises.push(updatePromise);

                transactionLogs.push({
                    senderId: numericBuyerUserId,
                    receiverId: sellerId,
                    senderName: buyerUser.name,
                    receiverName: sellerUser.name,
                    amount: payoutAmount,
                    date: new Date(),
                    description: `Payment for cart items from seller ${sellerUser.name}`,
                    status: 'completed',
                    productName: productName,
                });
            }
        }

        const sellerUpdateResults = await Promise.all(sellerUpdatePromises);

        sellerUpdateResults.forEach((result, index) => {
            const sellerId = Array.from(sellerPayouts.keys())[index];
            if (numericBuyerUserId !== sellerId) {
                if (result.modifiedCount === 0 && result.matchedCount === 0) {
                    throw new Error(`Failed to credit seller ${sellerId}: Not found.`);
                }
                if (result.modifiedCount === 0 && result.matchedCount === 1) {
                    console.warn(`Seller ${sellerId} revenue unmodified.`);
                }
            }
        });

        if (transactionLogs.length > 0) {
            await transaction.insertMany(transactionLogs, { session });
        }

        await session.commitTransaction();

        res.status(200).json({ message: 'Checkout successful!' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Checkout Failed:', error);
        res.status(400).json({ message: `Checkout failed: ${error.message}` });
    } finally {
        session.endSession();
    }
});

module.exports = router;