const mongoose = require('mongoose');
const Counter = require('./counter'); // Make sure the path is correct

const commentSchema = new mongoose.Schema({
    commentNo: {
        type: Number,
        unique: true,
    },
    description: {
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
        default: Date.now
    }
});

// Auto-increment commentNo using the Counter model
commentSchema.pre('save', async function (next) {
    if (this.isNew && !this.commentNo) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'comment' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            this.commentNo = counter.value;
            next();
        } catch (error) {
            console.error('Error auto-incrementing commentNo:', error);
            next(error);
        }
    } else {
        next();
    }
});

const Comments = mongoose.model('Comments', commentSchema);
module.exports = Comments;
