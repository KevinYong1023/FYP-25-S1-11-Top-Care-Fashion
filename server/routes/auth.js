// server/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.js');
const authenticate = require('../middleware/authenticate');

// --- Login Route ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        console.log("LOGIN IS USING AUTH.JS");
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// --- Registration Route ---
router.post('/register', async (req, res) => {
    const { username, name, email, phone, password, dob, gender, position } = req.body;

    if (!username || !name || !email || !phone || !password || !gender || !position) {
        return res.status(400).json({ message: 'Missing required registration fields' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({ message: `User with this ${field} already exists` });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUserObject = {
            username, name, email, phone, password: hashedPassword,
            dob: dob ? new Date(dob) : null, gender, position
        };

        if (position === 'user') {
            newUserObject.revenue = 0;
            console.log(`Registering 'user', setting initial balance for ${email}`);
        } else {
            console.log(`Registering '${position}', balance field will be omitted.`);
        }

        const newUser = new User(newUserObject);
        const savedUser = await newUser.save();

        const payload = { userId: savedUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// --- Get Current User Route (/me)
router.get('/me', authenticate, async (req, res) => {
    try {
        console.log("Req.userId in /me:", req.userId); // Log userId
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            console.log("User not found in DB");
            return res.status(404).json({ message: 'User not found' });
        }
        console.log("User Data from DB:", user);
        res.json({ userData: user });

    } catch (error) {
        console.error("Get Me Error:", error);
        res.status(500).json({ message: 'Server Error fetching user data' });
    }
});

router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email does not exist.' });
        }

        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the old one.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

module.exports = router; 
