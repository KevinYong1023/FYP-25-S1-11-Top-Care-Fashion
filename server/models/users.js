const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
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
  
  balance: {
    type: Number,
    required: false, // <<< Field does NOT have to exist
    min: [0, 'Balance cannot be negative.']
    // No 'default' here if you set it conditionally
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
