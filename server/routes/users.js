const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users.js');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken'); // make sure this is at the top!


// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong Password' });
        }

        if (user.status !== 'Active') {
            return res.status(400).json({ message: 'Inactive Account.' });
        }

        const token = jwt.sign(
            {
                id: user.userId,
                email: user.email,
                role: user.position,
            },
            process.env.JWT_SECRET || 'fallbackSecretKey',
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.userId,
                email: user.email,
                role: user.position,
                name: user.name,
                address: user.address || ''
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password
router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email does not exist.' });
        }

        // Check if the new password is the same as the current one
        const isMatch = await bcrypt.compare(newPassword, user.password);
        if (isMatch) {
            return res.status(400).json({ message: 'New password cannot be the same as the old one.' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update only the password field without triggering full validation
        user.password = hashedPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

// Register
router.post('/mainregister', async (req, res) => {
    const { username, name, email, phone, password, dob, gender, position, address } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let formattedDob = dob;
        if (dob && dob.includes('-')) {
            const [year, month, day] = dob.split('-');
            formattedDob = `${year}-${month}-${day}`;  // --> Convert to DD/MM/YYYY
        }

        // Create a new user instance
        const newUser = new User({
            username,
            name,
            email,
            phone,
            password: hashedPassword, // Store the hashed password
            dob: formattedDob, // Optional field
            gender, // Required field
            position, // Required field
            joined: new Date().toISOString().split('T')[0],
            status: "Active",
            address,
        });

        // Save the user in the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/user', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

  // Delete a user
  router.delete('/user/:email', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });  // Correctly find and delete the user by email
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting the user:", error);
        res.status(500).json({ message: 'Error deleting the user' });
    }
});

// Search users by name, status, and position (Case 1)
router.get('/user/search', async (req, res) => {
    const { name, status, position } = req.query;

    try {
        const query = {};

        // If 'name' is provided, use regex for name search
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        // If 'status' is provided, add it to the query filter
        if (status) {
            query.status = status;
        }

        // If 'position' is provided, add it to the query filter
        if (position) {
            query.position = position;
        }

        // Fetch users based on the dynamically constructed query
        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users' });
    }
});

// Filter users by position and status
router.get('/user/filter', async (req, res) => {
    const { position, status } = req.query;

    try {
        const query = {};

        // Add position filter if provided
        if (position) {
            query.position = position;
        }

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering users' });
    }
});

// Get user 
router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            userId: user.userId,
            username: user.username,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            position: user.position,
            joined: user.joined,
            status: user.status,
            address: user.address,
            revenue: user.revenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Update user by userId
router.put('/user/:email', async (req, res) => {
    const { email } = req.params;
    const { username, name, dob, gender, phone, address } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email }, // Find user by email
            { username, name, dob, gender, phone, address }, // Update the fields
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser); // Return the updated user details
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});

// Update User status by userId
router.put('/user/:email/status', async (req, res) => {
    const { email } = req.params;
    const { status } = req.body;

    try {
        const user = await User.findOneAndUpdate({ email: email }, { status: status }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// Get user name by userId
router.get('/users/:userId/name', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ name: user.name });
    } catch (error) {
        console.error('Error fetching user name:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
