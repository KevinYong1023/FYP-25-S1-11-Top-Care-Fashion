const express = require('express');
const router = express.Router();
const Ticket = require('../models/tickets.js');

router.post('/tickets', async (req, res) => {
    const { orderId, user, description } = req.body;
    try {
        // Validate required fields
        if (!orderId || !user || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newTicket = new Ticket({
            orderId,
            user: user.trim(),
            description: description.trim()
        });

        await newTicket.save();
        res.status(201).json({ message: 'Ticket created successfully', ticket: newTicket });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all Ticket
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find(); // Fetch all tickets from the collection
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

module.exports = router;
