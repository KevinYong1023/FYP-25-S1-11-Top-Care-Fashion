const mongoose = require('mongoose');

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
    required: true
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

// Pre-save hook to set auto-increment userId
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastUser = await User.findOne().sort({ userId: -1 });
      this.userId = lastUser ? lastUser.userId + 1 : 1; // Start from 1 if no users exist
    } catch (error) {
      console.error('Error auto-incrementing userId:', error);
    }
  }
  next();
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
