import bcrypt from 'bcrypt';
import User from '../../../models/users.js';
import Counter from '../../../models/counter.js';
const saltRounds = 10;

const userData = async () => {
    // Step 1: Remove all users with null userId to avoid duplication
            await User.deleteMany({});
            await User.deleteMany({ userId: null });
            console.log("All users with null userId removed");
    
            // Step 2: Reset userId counter
            const counter = await Counter.findOneAndUpdate(
                { name: 'userId' },  // Query by 'name' field instead of '_id'
                { $set: { value: 1 } },  // Reset the counter value to 1
                { upsert: true, new: true }
            );
            console.log("User ID counter reset");
    
            // Step 3: Create test data for product, ticket, order, comments
            const users = [
                {
                    userId: counter.value++,  // Assign the incremented userId
                    username: 'jjUser',
                    name: 'JJ',
                    email: 'user001@mail.com',
                    password: bcrypt.hashSync('12345678@', saltRounds),
                    dob: '2000-03-10',
                    gender: 'Male',
                    phone: '91234567',
                    position: 'User',
                    address: '10 Tampines Avenue, #05-101, Singapore 529482',
                    revenue: 150.75
                },
                {
                    userId: counter.value++,  // Increment for next user
                    username: 'tommyUser',
                    name: 'Tommy',
                    email: 'user002@mail.com',
                    password: bcrypt.hashSync('12345678@', saltRounds),
                    dob: '2000-03-10',
                    gender: 'Male',
                    phone: '91234567',
                    position: 'User',
                    address: '10 Eunos Avenue, #05-101, Singapore 529482',
                    revenue: 150.75
                },
                {
                    userId: counter.value++,  // Increment for next user
                    username: 'kevSup',
                    name: 'Kevin Customer Support',
                    email: 'csp001@mail.com',
                    password: bcrypt.hashSync('12345678@', saltRounds),
                    dob: '2000-07-15',
                    gender: 'Female',
                    phone: '81234567',
                    position: 'Customer Support'
                },
                {
                    userId: counter.value++,  // Increment for next user
                    username: 'tommyAdmin',
                    name: 'Tommy Admin',
                    email: 'admin001@mail.com',
                    password: bcrypt.hashSync('12345678@', saltRounds),
                    dob: '2000-01-01',
                    gender: 'Male',
                    phone: '83214567',
                    position: 'Admin'
                },
                {
                    userId: counter.value++,  // Increment for next user
                    username: 'jjManager',
                    name: 'JJ Manager',
                    email: 'manager001@mail.com',
                    password: bcrypt.hashSync('12345678@', saltRounds),
                    dob: '2000-05-25',
                    gender: 'Male',
                    phone: '92214567',
                    position: 'Manager'
                }
            ];
    
            // Insert the users
            const insertedUsers = await User.insertMany(users);
            console.log(`${insertedUsers.length} users created successfully.`);
    
    
            // Step 4: Update the counter value
            await Counter.findOneAndUpdate(
                { name: 'userId' },
                { $set: { value: counter.value } }
            );
            console.log("User ID counter updated");
    }

 export {userData}