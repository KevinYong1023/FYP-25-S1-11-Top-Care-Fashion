const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users.js'); // Import and Adjust the path to your model, Exp: User model

//Mnagae route:  Login route
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the user selected the correct role
        if (user.position !== role) {
            return res.status(400).json({ message: 'Incorrect role selected' });
        }

        // If login is successful, return user data (without the password)
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.position, // Use position instead of role
                name: user.name,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Registration route
router.post('/register', async (req, res) => {
    const {username, name, email, phone, password, dob, gender, position } = req.body;
    console.log('Request body:', req.body);

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            username,
            name,
            email,
            phone,
            password: hashedPassword, // Store the hashed password
            dob, // Optional field
            gender, // Required field
            position // Required field
        });

        // Save the user in the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
