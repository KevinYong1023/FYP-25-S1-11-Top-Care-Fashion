import mongoose from 'mongoose';
import { userData } from './TestData/data/users/users.js';
import { productData } from './TestData/data/product/product.js';

// MongoDB connection string
const mongoURI = 'mongodb+srv://fyp-development:fyp1234@fyp.lx0gt.mongodb.net/fyp';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB");
       // await userData();
        await productData();
        mongoose.disconnect();
    })
    .catch(err => {
        console.error("Error seeding users:", err);
        mongoose.disconnect();
    });
