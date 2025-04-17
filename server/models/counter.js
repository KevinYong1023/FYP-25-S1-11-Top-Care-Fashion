// COUNTER MODEL: Hanlde the increment logic
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true,default: 1 },
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;
