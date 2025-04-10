// server/routes/virtualPayments.js (Edited: No Sender/Buyer Deduction)

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');          // Ensure path is correct
const User = require('../models/users.js');                      // Ensure path/casing is correct
const transaction = require('../models/transaction.js'); // Ensure path/casing is correct
// const Product = require('../models/product.js'); // Optional: Only if verifying prices server-side

// Define getNumericUserId at the top of the file
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

    // Validation
    if (!recipientEmail || !amount) return res.status(400).json({ message: 'Recipient email and amount required.' });
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) return res.status(400).json({ message: 'Invalid amount.' });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Find Sender User (still needed for senderId in log & prevent self-transfer)
        const senderUser = await User.findById(senderUserId).select('_id').lean().session(session); // Only need ID now
        if (!senderUser) throw new Error('Sender user not found.');

        // Find Recipient User
        const recipientUser = await User.findOne({ email: recipientEmail }).select('_id position').session(session);
        if (!recipientUser) throw new Error('Recipient user not found.');
        if (recipientUser.position !== 'user') throw new Error('Recipient user cannot receive virtual currency.');
        const recipientUserId = recipientUser._id;

        // Prevent self-transfer
        if (senderUserId.toString() === recipientUserId.toString()) {
            throw new Error('Cannot send virtual currency to yourself.');
        }

        // --- Sender revenue check and decrement ARE REMOVED ---

        // Increment receiver's revenue
        const receiverUpdateResult = await User.updateOne(
            { _id: recipientUserId },
            { $inc: { revenue: transferAmount } } // Target 'revenue' field on User model
        ).session(session);

        if (receiverUpdateResult.modifiedCount === 0) {
            // This could happen if the recipient User document was deleted mid-transaction
            throw new Error('Failed to credit receiver revenue.');
        }

        // Log the transaction
        const transactionLog = new transaction({
            senderId: senderUserId,
            receiverId: recipientUserId,
            senderName: senderUser.name, // Add senderName
            receiverName: recipientUser.name, // Add receiverName
            amount: transferAmount,
            description: description,
            status: 'completed'
        });
        await transactionLog.save({ session });

        // Commit Transaction
        await session.commitTransaction();

        // Optionally get sender's current Revenue (it shouldn't have changed)
        const currentSenderData = await User.findById(senderUserId).select('revenue');

        res.status(200).json({
            message: 'Virtual currency transfer successful! (Sender revenue not deducted)',
            transactionId: transactionLog._id,
            newRevenue: currentSenderData ? currentSenderData.revenue : null // Reflects sender's unchanged revenue
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Virtual Transfer Failed:', error);
        res.status(400).json({ message: `Transfer failed: ${error.message}` });
    } finally {
        session.endSession();
    }
});


// --- Route 2: Cart Checkout (Buyer Revenue NOT deducted) ---
router.post('/checkout', authenticate, async (req, res) => {
    const { cartItems } = req.body;
    let buyerUserId = req.userId;

    // Convert buyerUserId to a number if it's an ObjectId string
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

    // Validation & Calculate totalAmount / sellerPayouts
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart invalid.' });
    }

    let totalAmount = 0;
    const sellerPayouts = new Map();

    try {
        cartItems.forEach(item => {
            const price = parseFloat(item.price);
            const quantity = parseInt(item.quantity, 10) || 1;
            const sellerId = item.sellerId;

            if (isNaN(price) || price <= 0 || !sellerId) {
                throw new Error(`Invalid cart item`);
            }

            const itemTotal = Math.round(price * quantity * 100) / 100;
            totalAmount += itemTotal;
            sellerPayouts.set(sellerId, (sellerPayouts.get(sellerId) || 0) + itemTotal);
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
        let transactionLogs = []; // Declare transactionLogs outside the loop

        for (const [sellerId, payoutAmount] of sellerPayouts.entries()) {
            if (numericBuyerUserId !== sellerId) {
                const sellerUser = await User.findOne({ userId: sellerId }).select('name').lean().session(session);
                if (!sellerUser) {
                    throw new Error(`Seller ${sellerId} not found.`);
                }

                 // Place the productName definition HERE:
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


// --- Export the router ---
module.exports = router;