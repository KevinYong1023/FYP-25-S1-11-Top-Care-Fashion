const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose); // Import mongoose-sequence

// Define the orderHistory schema
const commentSchema = new mongoose.Schema({
    commentNo: {
        type: Number,
        unique: true,  // Ensure the ticketNumber is unique
    },
    description:{ // User sell the product: Product A: User1, Product B: User2 
        type:String, 
        required:true
    },
    product:{
        type: String,
        required: true
    },
    madeBy:{
        type: String,
        required: true
    },
    created:{
        type:Date,
        default:Date.now()
    }
});

// Add auto-increment to the ticketNumber field
commentSchema.plugin(AutoIncrement, {inc_field: 'commentNo'});

// Create the Ticket model
const Comments = mongoose.model('Comments', commentSchema);

// Export the model
module.exports = Comments;
