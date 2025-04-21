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
    enum: ['Top', 'Bottom', 'Footwear'],
    required: true
  },
  occasion: {
    type: String,
    enum: ['Casual', 'Smart', 'Formal', 'Sport'],
    required: true
  },
  imageUrl: { // use base64 store
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
  userId: {
    type: Number,
    required: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isOrdered:{
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
