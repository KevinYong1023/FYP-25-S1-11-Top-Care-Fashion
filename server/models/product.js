const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
