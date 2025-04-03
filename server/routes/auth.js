// server/routes/auth.js

const express = require('express');
const router = express.Router();
// Assuming you installed 'bcrypt', use require('bcrypt')
const bcrypt = require('bcrypt'); // Changed from bcryptjs for consistency
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Still needed for session
const User = require('../models/users.js'); // Assuming filename is users.js
// const VirtualWallet = require('../models/VirtualWallet'); // <-- REMOVE THIS
// const Ticket = require('../models/tickets.js'); // <-- REMOVE THIS
// const OrderHistory = require('../models/orderhistory'); // <-- REMOVE THIS
const authenticate = require('../middleware/authenticate'); // Keep this

// --- Login Route --- (No changes needed in its logic)
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
     if (!email || !password || !role) { return res.status(400).json({ message: 'Email, password, and role are required' }); }
    try {
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'Invalid credentials' }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'Invalid credentials' }); }

        if (user.position !== role) { return res.status(400).json({ message: 'Incorrect role selected' }); }

        const payload = { userId: user._id };
        console.log('JWT Secret Check in login route:', process.env.JWT_SECRET ? 'Loaded OK' : '!!! MISSING or UNDEFINED !!!'); // Good check
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token }); // Send token

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


// --- Registration Route - MODIFIED ---
router.post('/register', async (req, res) => {
    const { username, name, email, phone, password, dob, gender, position } = req.body;

    // Input Validation
    if (!username || !name || !email || !phone || !password || !gender || !position) {
        return res.status(400).json({ message: 'Missing required registration fields' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] }).session(session);
        if (existingUser) {
            await session.abortTransaction(); session.endSession();
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({ message: `User with this ${field} already exists` });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // --- EDIT: Prepare newUser data with conditional balance ---
        const newUserObject = {
            username, name, email, phone, password: hashedPassword,
            dob: dob ? new Date(dob) : null, gender, position
        };

        // Set initial balance ONLY if position is 'user'
        if (position === 'user') {
            newUserObject.balance = 100; // Set initial balance (adjust value if needed)
            console.log(`Registering 'user', setting initial balance for ${email}`);
        } else {
            console.log(`Registering '${position}', balance field will be omitted.`);
            // No balance field added for other roles
        }
        // --- END EDIT ---

        // Create and save new user using the prepared object
        const newUser = new User(newUserObject);
        const savedUser = await newUser.save({ session });

        // --- REMOVED Virtual Wallet Creation Block ---

        await session.commitTransaction();

        // Generate and Return JWT
        const payload = { userId: savedUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });

    } catch (error) {
        await session.abortTransaction();
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    } finally {
        session.endSession();
    }
});

// --- Get Current User Route (/me)
router.get('/me', authenticate, async (req, res) => {
    try {
        // req.userId is attached by the authenticate middleware
        // Find user by ID, exclude password field
        const user = await User.findById(req.userId).select('-password'); // Balance field will be included if it exists

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // --- EDIT: Remove separate wallet query ---
        // The 'user' object now directly contains 'balance' if the user has the field (i.e., if position='user')
        // It will be undefined for other roles if using required: false in User schema
        res.json({ userData: user });
        // --- END EDIT ---

    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: 'Server Error fetching user data' });
    }
});


router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Check if email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email does not exist.' });
      }
  
      console.log("User found:", user);
  
      // Check if the new password is the same as the current one
      const isMatch = await bcrypt.compare(newPassword, user.password);
      if (isMatch) {
        return res.status(400).json({ message: 'New password cannot be the same as the old one.' });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Hashed password:", hashedPassword);
  
      // Update only the password field without triggering full validation
      user.password = hashedPassword;
      await user.save({ validateBeforeSave: false }); // Disable validation before save
  
      return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  });

module.exports = router;