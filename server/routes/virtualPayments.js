// server/routes/virtualPayments.js

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authenticate = require('../middleware/authenticate');
const User = require('../models/users.js'); // Using User model for balance
// const VirtualWallet = require('../models/VirtualWallet'); // <-- REMOVED
// Assuming model file is VirtualTransaction.js (PascalCase)
const VirtualTransaction = require('../models/VirtualTransaction'); // <-- CORRECTED IMPORT

// POST /api/virtual/transfer
router.post('/transfer', authenticate, async (req, res) => {
    const { recipientEmail, amount, description } = req.body;
    const senderUserId = req.userId; // Authenticated sender's User ID

    // --- Validation ---
    if (!recipientEmail || !amount) return res.status(400).json({ message: 'Recipient email and amount required.' });
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) return res.status(400).json({ message: 'Invalid amount.' });

    const session = await mongoose.startSession();
    session.startTransaction(); // START ATOMIC OPERATION

    try {
        // --- STEP 1: Find Sender User (needed for balance check) --- CHANGED
        const senderUser = await User.findById(senderUserId).session(session);
        if (!senderUser) {
            // This shouldn't happen if authenticate middleware works correctly
            throw new Error('Sender user not found.');
        }

        // --- STEP 2: Find Recipient User --- CHANGED (Combined with Step 1 logic)
        const recipientUser = await User.findOne({ email: recipientEmail }).select('_id position').session(session); // Select needed fields
        if (!recipientUser) throw new Error('Recipient user not found.');
        if (recipientUser.position !== 'user') throw new Error('Recipient user cannot receive virtual currency.');
        const recipientUserId = recipientUser._id;

        // Prevent self-transfer
        if (senderUserId.toString() === recipientUserId.toString()) {
            throw new Error('Cannot send virtual currency to yourself.');
        }

        // --- STEP 3: Check Sender's Balance --- CHANGED (Check User.balance)
        // Check if balance field exists and is sufficient
        if (senderUser.balance === undefined || senderUser.balance === null || senderUser.balance < transferAmount) {
            throw new Error('Insufficient virtual balance.');
        }

        // --- STEP 4: Perform Atomic Transfer using USER collection --- CHANGED
        // Decrement sender's balance - filter includes check for sufficient funds
        const senderUpdateResult = await User.updateOne(
            { _id: senderUserId, balance: { $gte: transferAmount } }, // Check balance again in filter for atomicity
            { $inc: { balance: -transferAmount } } // Target 'balance' field
        ).session(session);

        // Check if sender update actually happened
        if (senderUpdateResult.modifiedCount === 0) {
            // If balance was checked above, this likely means a concurrent update conflict
            throw new Error('Failed to debit sender balance (insufficient funds or conflict).');
        }

        // Increment receiver's balance - $inc creates/sets to amount if field omitted previously
        const receiverUpdateResult = await User.updateOne(
            { _id: recipientUserId },
            { $inc: { balance: transferAmount } } // Target 'balance' field
        ).session(session);

        // Check if receiver update happened
        if (receiverUpdateResult.modifiedCount === 0) {
            // Should only fail if recipient doc was somehow deleted mid-transaction
            throw new Error('Failed to credit receiver balance.');
        }

        // --- STEP 5: Log the transaction (within session) --- (Uses VirtualTransaction Model - NO CHANGE needed here except import)
        const transactionLog = new VirtualTransaction({
            senderId: senderUserId,
            receiverId: recipientUserId,
            amount: transferAmount,
            description: description,
            status: 'completed' // Status is 'completed' as DB ops succeeded
        });
        await transactionLog.save({ session });

        // --- STEP 6: Commit Transaction ---
        await session.commitTransaction(); // COMMIT ATOMIC OPERATION

        // --- STEP 7: Get updated balance (optional) --- CHANGED (Query User model)
        const updatedSender = await User.findById(senderUserId).select('balance'); // Get updated user balance

        res.status(200).json({
            message: 'Virtual currency transfer successful!',
            transactionId: transactionLog._id,
            newBalance: updatedSender ? updatedSender.balance : null // Return user's balance
        });

    } catch (error) {
        await session.abortTransaction(); // ROLLBACK ATOMIC OPERATION
        console.error('Virtual Transfer Failed:', error);
        res.status(400).json({ message: `Transfer failed: ${error.message}` }); // Send back specific error
    } finally {
        session.endSession(); // ALWAYS end the session
    }
});

module.exports = router;