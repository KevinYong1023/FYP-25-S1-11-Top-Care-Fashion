const mongoose = require('mongoose');
const Counter = require('./counter'); // Import the Counter model

// Define the user schema
const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,  // Ensure the userId is unique
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  joined: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    default:"Active"
  },
  address: {
    type: String,
    required: false
  },

  revenue:{
    type: Number, // Change it to the correspond value
    required:false,
    min: [0, 'Balance cannot be negative.']
  }
});


userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'userId' },  // Query by the 'name' field instead of _id
        { $inc: { value: 1 } }, // Increment the counter
        { new: true, upsert: true }
      );
      this.userId = counter.value;  // Set userId based on the counter value
    } catch (error) {
      console.error('Error auto-incrementing userId from counter:', error);
      return next(error);
    }
  }
  next();
});


// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
