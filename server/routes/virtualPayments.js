// server/routes/virtualPayments.js (Edited: No Sender/Buyer Deduction)

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');          // Ensure path is correct
const User = require('../models/users.js');                      // Ensure path/casing is correct
const transaction = require('../models/transaction.js'); // Ensure path/casing is correct
// const Product = require('../models/product.js'); // Optional: Only if verifying prices server-side

// --- Route 1: Direct User-to-User Transfer (Sender balance NOT deducted) ---
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

        // --- Sender balance check and decrement ARE REMOVED ---

        // Increment receiver's balance
        const receiverUpdateResult = await User.updateOne(
            { _id: recipientUserId },
            { $inc: { balance: transferAmount } } // Target 'balance' field on User model
        ).session(session);

        if (receiverUpdateResult.modifiedCount === 0) {
            // This could happen if the recipient User document was deleted mid-transaction
            throw new Error('Failed to credit receiver balance.');
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

        // Optionally get sender's current balance (it shouldn't have changed)
        const currentSenderData = await User.findById(senderUserId).select('balance');

        res.status(200).json({
            message: 'Virtual currency transfer successful! (Sender balance not deducted)',
            transactionId: transactionLog._id,
            newBalance: currentSenderData ? currentSenderData.balance : null // Reflects sender's unchanged balance
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Virtual Transfer Failed:', error);
        res.status(400).json({ message: `Transfer failed: ${error.message}` });
    } finally {
        session.endSession();
    }
});


// --- Route 2: Cart Checkout (Buyer balance NOT deducted) ---
router.post('/checkout', authenticate, async (req, res) => {
    const { cartItems } = req.body;
    const buyerUserId = req.userId; // Authenticated buyer

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
        const buyerUser = await User.findById(buyerUserId).select('_id').lean().session(session); // Only need ID
        if (!buyerUser) throw new Error('Buyer user not found.');

        // --- Buyer balance check and decrement ARE REMOVED ---

        // 3. Increment Each Seller's Balance
        const sellerUpdatePromises = [];
        for (const [sellerId, payoutAmount] of sellerPayouts.entries()) {
            if(buyerUserId.toString() === sellerId.toString()) { console.warn(`Skipping self-payout`); continue; }

            const updatePromise = User.updateOne(
                { _id: sellerId },
                { $inc: { balance: payoutAmount } } // Target 'balance' field
            ).session(session);
            sellerUpdatePromises.push(updatePromise);
        }
        const sellerUpdateResults = await Promise.all(sellerUpdatePromises);

        // Check seller results
        sellerUpdateResults.forEach((result, index) => {
             const sellerId = Array.from(sellerPayouts.keys())[index];
             if(buyerUserId.toString() === sellerId.toString()) return; // Skip check if self-payout was skipped
            if (result.modifiedCount === 0 && result.matchedCount === 0) throw new Error(`Failed to credit seller ${sellerId}: Not found.`);
            if (result.modifiedCount === 0 && result.matchedCount === 1) console.warn(`Seller ${sellerId} balance unmodified.`);
        });

        // 4. Log the transactions
        const transactionLogs = Array.from(sellerPayouts.entries())
             .filter(([sellerId, payoutAmount]) => buyerUserId.toString() !== sellerId.toString())
             .map(([sellerId, payoutAmount]) => ({ /* ... log data ... */
                senderId: buyerUserId, receiverId: sellerId, amount: payoutAmount,
                description: `Payment for cart items from seller ${sellerId}`, status: 'completed'
             }));
        if (transactionLogs.length > 0) {
            await transaction.insertMany(transactionLogs, { session });
        }

        // 5. Commit Transaction
        await session.commitTransaction();

        // Get buyer's balance (which shouldn't have changed)
        const updatedBuyer = await User.findById(buyerUserId).select('balance');

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