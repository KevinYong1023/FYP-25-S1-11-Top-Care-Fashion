const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users.js');

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong Password' });
        }

        // If login is successful, return user data (without the password)
        res.json({
            message: 'Login successful',
            user: {
                id: user.userId, // Use 'userId' instead of '_id'
                email: user.email,
                role: user.position, // Use 'position' instead of 'role'
                name: user.name,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
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
router.post('/register', async (req, res) => {
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

        // Create a new user instance
        const newUser = new User({
            username,
            name,
            email,
            phone,
            password: hashedPassword, // Store the hashed password
            dob, // Optional field
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

// Search users by name
router.get('/user/search', async (req, res) => {
    const { name } = req.query;

    try {
        const users = await User.find({ name: { $regex: name, $options: 'i' } }); // Case-insensitive search
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
            username: user.username,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            position: user.position,
            address: user.address
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

module.exports = router;
