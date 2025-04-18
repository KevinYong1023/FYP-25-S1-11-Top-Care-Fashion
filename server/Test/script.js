import mongoose from 'mongoose';
import { userData } from './Data/users.js';
import { productData } from './Data/product.js';
import { commentData } from './Data/comments.js';
import {orderData} from './Data/order.js';
import { ticketData } from './Data/ticket.js';

// MongoDB connection string
const mongoURI = 'mongodb+srv://fyp-development:fyp1234@fyp.lx0gt.mongodb.net/fyp';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
      console.log("Connected to MongoDB");
      const collections = ['users', 'products', 'orders', 'comments', 'tickets', 'counters'];
       for (const collection of collections) {
            try {
                await mongoose.connection.db.dropCollection(collection);
                console.log(`${collection} collection dropped.`);
            } catch (err) {
                console.log(`${collection} collection does not exist or failed to drop.`);
            }
        }
        await userData();
        await productData();
        await commentData()
        await orderData()
        await ticketData();
        console.log("Data Created")
        mongoose.disconnect();
    })
    .catch(err => {
        console.error("Error seeding users:", err);
        mongoose.disconnect();
    });
