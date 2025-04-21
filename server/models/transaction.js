// models/VirtualTransaction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const virtualTransactionSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  amount: { type: Number, required: true, min: 0.01 }, // Amount of fake currency

  status: { type: String, required: true, enum: ['completed'], default: 'completed' },

  description: { type: String, trim: true, required: false }

}, 

{ timestamps: true }); // createdAt indicates when transfer happened

module.exports = mongoose.model('VirtualTransaction', virtualTransactionSchema);