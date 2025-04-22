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


commentSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'commentNo' },  // Query by the 'name' field instead of _id
        { $inc: { value: 1 } }, // Increment the counter
        { new: true, upsert: true }
      );
      this.commentNo = counter.value;  // Set commentNo based on the counter value
    } catch (error) {
      console.error('Error auto-incrementing commentNo from counter:', error);
      return next(error);
    }
  }
  next();
});


const Comments = mongoose.model('Comments', commentSchema);
module.exports = Comments;
