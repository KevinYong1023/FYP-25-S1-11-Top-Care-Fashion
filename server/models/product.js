const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['Top', 'Bottom', 'Footwear', 'Other'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },

  seller: {  // user full name
    type: String,
    required: true
  },
  email: {  // user email
    type: String,
    required: true
  },
  userId: { // Stores the ObjectId of the user who listed this product (the Seller)
    type: Schema.Types.ObjectId,
    ref: 'User', // Creates reference to the User model
    required: true,
    index: true // Good to index for finding all products by a user
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
