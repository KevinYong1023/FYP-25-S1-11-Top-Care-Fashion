const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Define the user schema
const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,  // Ensure the ticketNumber is unique
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
  joined:{
    type: Date,
    default: Date.now
  },
  status:{
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  revenue:{
    type: String, // Change it to the correspond value
    required:false
  }
});

// Add auto-increment to the ticketNumber field
userSchema.plugin(AutoIncrement, {inc_field: 'userId'});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;