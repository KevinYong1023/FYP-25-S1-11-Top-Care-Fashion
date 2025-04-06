const express = require('express');
const router = express.Router();
const Comments = require('../models/comments');

// ✅ Get all comments
router.get('/comments/madeby/:user', async (req, res) => {
  try {
    const { user } = req.params;
    const comments = await Comments.find({ madeBy: user }).sort({ commentNo: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments by user:', err);
    res.status(500).json({ error: 'Failed to fetch comments by user' });
  }
});
// ✅ Get latest 3 comments for a specific product
router.get('/comments/latest/:product', async (req, res) => {
  try {
    const { product } = req.params;
    console.log("Calling latest comments for:", product);
    const latestComments = await Comments.find({ product: new RegExp(`^${product}$`, 'i') })
      .sort({ commentNo: -1 })
      .limit(3);
    res.json(latestComments);
  } catch (err) {
    console.error('Error fetching latest comments:', err);
    res.status(500).json({ error: 'Failed to fetch latest comments' });
  }
});

// ✅ Create a comment
router.post('/comments/:product', async (req, res) => {
  try {
    const { description, product, madeBy } = req.body;
    // Validate required fields
    if (!description || !product || !madeBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new comment document
    const newComment = new Comments({
      description,
      product,
      madeBy
    });

    // Save to MongoDB
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});
// Remove a comment
router.delete('/comments/:commentNo', async (req, res) => {
  try {
    const { commentNo } = req.params;
    const deleted = await Comments.findOneAndDelete({ commentNo });

    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully', deleted });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});
module.exports = router;
