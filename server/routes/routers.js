const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users.js');
const Ticket = require('../models/tickets.js');
const OrderHistory = require('../models/orderhistory'); // Ensure correct path to the model
const VirtualWallet = require('../models/VirtualWallet');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authenticate');

// API to get order history by username
router.get('/order-history/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        const orders = await OrderHistory.find({ user: username });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Error fetching order history' });
    }
});

// API to get order details by order ID (_id)
router.get('/order-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await OrderHistory.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Error fetching order details' });
    }
});


// Route to get a specific order by invoice ID (_id)
router.get('/api/order-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find order by _id (MongoDB ObjectId)
        const order = await OrderHistory.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login route
 /* router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
     // Input validation
     if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Generic error
        }

        const isMatch = await bcrypt.compare(password, user.password); // Use consistent bcrypt variable
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Generic error
        }

        if (user.position !== role) {
            return res.status(400).json({ message: 'Incorrect role selected' });
        }

        // --- EDIT: Generate and Return JWT ---
        const payload = { userId: user._id };

        console.log('JWT Secret Check in login route:', process.env.JWT_SECRET ? 'Loaded OK' : '!!! MISSING or UNDEFINED !!!');

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Example expiry
        );

        res.json({ token }); // Send ONLY the token
        // --- END EDIT ---

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
}); */

/* // Registration route
router.post('/register', async (req, res) => {
    const { username, name, email, phone, password, dob, gender, position } = req.body;

    // --- Add Input Validation ---
    if (!username || !name || !email || !phone || !password || !gender || !position) {
        return res.status(400).json({ message: 'Missing required registration fields' });
    }
    // Add more specific validation (email format, password strength etc.)

    // --- EDIT: Use Mongoose Session for Atomic Operations ---
    const session = await mongoose.startSession();
    session.startTransaction();
    // --- END EDIT ---

    try {
        // Check if the user already exists (check both email and username if both should be unique)
        const existingUser = await User.findOne({ $or: [{ email }, { username }] }).session(session); // Use session
        if (existingUser) {
             await session.abortTransaction(); // Abort before sending response
             session.endSession();
             // Be specific about which field exists
             const field = existingUser.email === email ? 'email' : 'username';
            return res.status(400).json({ message: `User with this ${field} already exists` });
        }

        // Hash the password (ensure 'bcrypt' variable matches import)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            username,
            name,
            email,
            phone,
            password: hashedPassword,
            dob: dob ? new Date(dob) : null, // Convert dob string to Date if provided
            gender,
            position
        });

        // Save the user within the transaction
        const savedUser = await newUser.save({ session });

        // --- EDIT: Conditionally create Virtual Wallet ---
        if (savedUser.position === 'user') { // Check if the position is 'user'
            console.log(`Registering 'user', creating wallet for ${savedUser._id}`);
            const wallet = new VirtualWallet({ userId: savedUser._id }); // Link via userId
            await wallet.save({ session }); // Save wallet within transaction
        } else {
            console.log(`Registering '${savedUser.position}', skipping wallet creation.`);
        }
        // --- END EDIT ---

        // --- EDIT: Commit the transaction ---
        await session.commitTransaction();
        // --- END EDIT ---

        // --- EDIT: Generate and Return JWT ---
        const payload = { userId: savedUser._id };
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
         res.status(201).json({ token }); // Return token instead of simple message
         // --- END EDIT ---

    } catch (error) {
        // --- EDIT: Abort transaction on error ---
        await session.abortTransaction();
        // --- END EDIT ---
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    } finally {
         // --- EDIT: Always end the session ---
         session.endSession();
         // --- END EDIT ---
    }
}); */

// Get all Ticket
router.get('/tickets', authenticate, async (req, res) => { // <-- 'authenticate' added here
    // If the request reaches here, the token was valid and authenticate() called next()
    // req.userId should now be available from the middleware
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets' });
    }
});

// Get a single ticket by ID
router.get('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id); // Find the ticket by ID
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the ticket data
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket' });
    }
});


// Delete a ticket
router.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the ticket' });
    }
});

// Update ticket's assignee and status
router.put('/tickets/:id/assign', async (req, res) => {
    const { assignee, status } = req.body; // Get the assignee and status from the request body
    try {
        // Find the ticket by ID and update both assignee and status from the request body
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { assignee, status }, // Use dynamic values from the request
            { new: true } // Return the updated ticket
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket); // Return the updated ticket
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ message: 'Error updating ticket' });
    }
});


// Update the ticket's status
router.put('/tickets/:id/status', async (req, res) => {
    const { status } = req.body; // Get the status from the request body
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true } // Return the updated ticket
        );
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the updated ticket
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket' });
    }
});


// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Get user by email
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
            // Add other user fields if necessary
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Update user by email
router.put('/user/:email', async (req, res) => {
    const { email } = req.params;
    const { name, dob, gender, phone } = req.body; // Get updated fields from the request body

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { name, dob, gender, phone },
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser); // Return the updated user details
    } catch (error) {
        res.status(500).json({ message: 'Error updating user profile' });
    }
});


// Update a ticket's assignee
router.put('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { assignee, status } = req.body; // You might want to also update the status

    try {
        const ticket = await Ticket.findByIdAndUpdate(id, { assignee, status }, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the updated ticket
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket' });
    }
});

// Get the user information by email
router.get('/user/:email', async (req, res) => {
    const { email } = req.params; // Get the email from the request params
    try {
        // Find the user by email in the database
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the full user details as a JSON response
        res.json({
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            position: user.position,
            // Add other user fields if necessary
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }




    
});


module.exports = router;
