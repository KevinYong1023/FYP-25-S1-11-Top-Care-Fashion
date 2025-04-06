const express = require('express');
const router = express.Router();
const Ticket = require('../models/tickets.js');

// Create a new ticket
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

// Get all tickets
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find(); // Fetch all tickets from the collection
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets' });
    }
});

// Get a single ticket by custom ticketId (not by _id)
router.get('/tickets/:ticketId', async (req, res) => {
    try {
        // Use ticketId to find the ticket instead of _id
        const ticket = await Ticket.findOne({ ticketId: req.params.ticketId }); // Find by ticketId
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the ticket data
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket' });
    }
});

// Delete a ticket by custom ticketId
router.delete('/tickets/:ticketId', async (req, res) => {
    try {
        // Use ticketId to find and delete the ticket
        const ticket = await Ticket.findOneAndDelete({ ticketId: req.params.ticketId }); // Use ticketId
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the ticket' });
    }
});

// Update ticket's assignee and status by custom ticketId
router.put('/tickets/:ticketId/assign', async (req, res) => {
    const { assignee, status } = req.body; // Get the assignee and status from the request body
    try {
        // Find the ticket by ticketId and update both assignee and status from the request body
        const ticket = await Ticket.findOneAndUpdate(
            { ticketId: req.params.ticketId }, // Use ticketId
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

// Update the ticket's status by custom ticketId
router.put('/tickets/:ticketId/status', async (req, res) => {
    const { status } = req.body; // Get the status from the request body
    try {
        // Find the ticket by ticketId and update its status
        const ticket = await Ticket.findOneAndUpdate(
            { ticketId: req.params.ticketId }, // Use ticketId
            { status }, // Use dynamic value from the request
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

// Update a ticket's assignee and status by custom ticketId
router.put('/tickets/:ticketId', async (req, res) => {
    const { assignee, status } = req.body; // Get the assignee and status from the request body
    try {
        // Find the ticket by ticketId and update both assignee and status
        const ticket = await Ticket.findOneAndUpdate(
            { ticketId: req.params.ticketId }, // Use ticketId
            { assignee, status }, // Update assignee and status
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

module.exports = router;