const mongoose = require('mongoose');

// Define the comments schema
const commentSchema = new mongoose.Schema({
    commentNo: {
        type: Number,
        unique: true,  // Ensure the commentNo is unique
    },
    description: { // User selling the product: Product A: User1, Product B: User2
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    madeBy: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

// Pre-save hook to set auto-increment commentNo
commentSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const lastComment = await Comments.findOne().sort({ commentNo: -1 });
            this.commentNo = lastComment ? lastComment.commentNo + 1 : 1; // Start from 1 if no comments exist
        } catch (error) {
            console.error('Error auto-incrementing commentNo:', error);
        }
    }
    next();
});

// Create the Comments model
const Comments = mongoose.model('Comments', commentSchema);

// Export the model
module.exports = Comments;
