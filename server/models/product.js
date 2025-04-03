const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

const productSchema = new mongoose.Schema({
  productNo: {
    type: Number,
    unique: true,  
},
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
  ocassion:{
    type:Array,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  email: {  // user email of uploader
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add auto-increment to the ticketNumber field
productSchema.plugin(AutoIncrement, {inc_field: 'productNo'});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
