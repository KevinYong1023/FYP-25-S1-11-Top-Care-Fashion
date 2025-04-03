/*
/ models/VirtualWallet.js (Schema Definition - No Change)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const virtualWalletSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Still refers to the User model
        required: true,
        unique: true,
        index: true
    },
    virtualBalance: {
        type: Number,
        required: true,
        default: 100,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('VirtualWallet', virtualWalletSchema); */