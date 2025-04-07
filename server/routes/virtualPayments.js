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
    const senderUserId = req.userId;

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
    const buyerUserId = req.userId; // Authenticated buyer
    const numericBuyerUserId = getNumericUserId(req.userId); 

    // Validation & Calculate totalAmount / sellerPayouts
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) return res.status(400).json({ message: 'Cart invalid.' });
    let totalAmount = 0;
    const sellerPayouts = new Map();
    try {
        cartItems.forEach(item => { /* ... calculate total, aggregate sellerPayouts ... */
             const price = parseFloat(item.price);
             const quantity = parseInt(item.quantity, 10) || 1;
             const sellerId = item.sellerId;
             if (isNaN(price) || price <= 0 || !sellerId) throw new Error(`Invalid cart item`);
             const itemTotal = Math.round(price * quantity * 100) / 100;
             totalAmount += itemTotal;
             sellerPayouts.set(sellerId, (sellerPayouts.get(sellerId) || 0) + itemTotal);
        });
        totalAmount = Math.round(totalAmount * 100) / 100;
        if (totalAmount <= 0) throw new Error('Total must be positive.');
    } catch (validationError) { return res.status(400).json({ message: `Invalid cart data: ${validationError.message}` }); }


    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find Buyer (Still needed for senderId in logs & self-payout check)
        const buyerUser = await User.findById(buyerUserId).select('userId').lean().session(session); // Only need ID
        if (!buyerUser) throw new Error('Buyer user not found.');

        // --- Buyer revenue check and decrement ARE REMOVED ---

        // 3. Increment Each Seller's revenue
        const sellerUpdatePromises = [];
        for (const [sellerId, payoutAmount] of sellerPayouts.entries()) {
            if(buyerUserId.toString() === sellerId.toString()) { console.warn(`Skipping self-payout`); continue; }

            const updatePromise = User.updateOne(
                { userId: sellerId },
                { $inc: { revenue: payoutAmount } } // Target 'revenue' field
            ).session(session);
            sellerUpdatePromises.push(updatePromise);
        }
        const sellerUpdateResults = await Promise.all(sellerUpdatePromises);

        // Check seller results
        sellerUpdateResults.forEach((result, index) => {
             const sellerId = Array.from(sellerPayouts.keys())[index];
             if(buyerUserId.toString() === sellerId.toString()) return; // Skip check if self-payout was skipped
            if (result.modifiedCount === 0 && result.matchedCount === 0) throw new Error(`Failed to credit seller ${sellerId}: Not found.`);
            if (result.modifiedCount === 0 && result.matchedCount === 1) console.warn(`Seller ${sellerId} revenue unmodified.`);
        });

        // 4. Log the transactions
        const transactionLogs = Array.from(sellerPayouts.entries())
    .filter(([sellerId, payoutAmount]) => buyerUserId.toString() !== numericBuyerUserId.toString())
    .map(([sellerId, payoutAmount]) => {
        // Ensure buyerUserId is a number
        const numericBuyerUserId = typeof buyerUserId === 'number' ? buyerUserId : parseInt(buyerUserId, 10);

        // Check if conversion was successful
        if (isNaN(numericBuyerUserId)) {
            console.error("Invalid buyerUserId (not a number):", buyerUserId);
            // Handle the error appropriately (e.g., throw an error, skip this transaction)
            return null; // Skip this transaction
        }

        // Ensure sellerId is a number
        const numericSellerId = typeof sellerId === 'number' ? sellerId : parseInt(sellerId, 10);

        // Check if conversion was successful
        if (isNaN(numericSellerId)) {
            console.error("Invalid sellerId (not a number):", sellerId);
            // Handle the error appropriately (e.g., throw an error, skip this transaction)
            return null; // Skip this transaction
        }

        return {
            senderId: numericBuyerUserId,
            receiverId: numericSellerId,
            amount: payoutAmount,
            description: `Payment for cart items from seller ${sellerId}`,
            status: 'completed'
        };
    }).filter(log => log !== null); // Remove null entries due to invalid ids

if (transactionLogs.length > 0) {
    await transaction.insertMany(transactionLogs, { session });
}

        // 5. Commit Transaction
        await session.commitTransaction();

        // Get buyer's revenue (which shouldn't have changed)
        const updatedBuyer = await User.findById(buyerUserId).select('revenue');

        res.status(200).json({
            message: 'Checkout successful!'
        });

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