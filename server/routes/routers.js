const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users.js');
const Ticket = require('../models/tickets.js');
const OrderHistory = require('../models/orderhistory'); // Ensure correct path to the model
const Product = require('../models/product');


// API to get order history by username
router.get('/order-history/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        const orders = await OrderHistory.find({ user: username });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ error: 'Error fetching order history' });
    }
});

// API to get order details by order ID (_id)
router.get('/order-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await OrderHistory.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Error fetching order details' });
    }
});


// Route to get a specific order by invoice ID (_id)
router.get('/api/order-details/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find order by _id (MongoDB ObjectId)
        const order = await OrderHistory.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login route
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if the user selected the correct role
        if (user.position !== role) {
            return res.status(400).json({ message: 'Incorrect role selected' });
        }

        // If login is successful, return user data (without the password)
        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                role: user.position, // Use position instead of role
                name: user.name,
                profile_pic: user.profile_pic
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      // Check if email exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email does not exist.' });
      }
  
      console.log("User found:", user);
  
      // Check if the new password is the same as the current one
      const isMatch = await bcrypt.compare(newPassword, user.password);
      if (isMatch) {
        return res.status(400).json({ message: 'New password cannot be the same as the old one.' });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("Hashed password:", hashedPassword);
  
      // Update only the password field without triggering full validation
      user.password = hashedPassword;
      await user.save({ validateBeforeSave: false }); // Disable validation before save
  
      return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
      console.error("Error during password reset:", error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  });
  

// Registration route
router.post('/register', async (req, res) => {
    const {username, name, email, phone, password, dob, gender, position, address } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user instance
        const newUser = new User({
            username,
            name,
            email,
            phone,
            password: hashedPassword, // Store the hashed password
            dob, // Optional field
            gender, // Required field
            position, // Required field
            joined: new Date().toISOString().split('T')[0], 
            status:"Active",
            address,
        });

        // Save the user in the database
        await newUser.save();

        // Send success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all Ticket
router.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find(); // Fetch all tickets from the collection
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets' });
    }
});

// Get a single ticket by ID
router.get('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id); // Find the ticket by ID
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the ticket data
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket' });
    }
});


// Delete a ticket
router.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the ticket' });
    }
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const ticket = await User.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting the ticket' });
    }
});

// Update ticket's assignee and status
router.put('/tickets/:id/assign', async (req, res) => {
    const { assignee, status } = req.body; // Get the assignee and status from the request body
    try {
        // Find the ticket by ID and update both assignee and status from the request body
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { assignee, status }, // Use dynamic values from the request
            { new: true } // Return the updated ticket
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket); // Return the updated ticket
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(500).json({ message: 'Error updating ticket' });
    }
});


// Update the ticket's status
router.put('/tickets/:id/status', async (req, res) => {
    const { status } = req.body; // Get the status from the request body
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true } // Return the updated ticket
        );
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the updated ticket
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket' });
    }
});


// Get all users
router.get('/user', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Search users by name
router.get('/user/search', async (req, res) => {
    const { name } = req.query;

    try {
        const users = await User.find({ name: { $regex: name, $options: 'i' } }); // Case-insensitive search
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users' });
    }
});

// Filter users by position and status
router.get('/user/filter', async (req, res) => {
    const { position, status } = req.query;

    try {
        const query = {};

        // Add position filter if provided
        if (position) {
            query.position = position;
        }

        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        const users = await User.find(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering users' });
    }
});


// Get user by email
router.get('/user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            username: user.username,
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            position: user.position,
            address: user.address
            // Add other user fields if necessary
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

// Update user by email
router.put('/user/:email', async (req, res) => {
    const { email } = req.params;
    const { username, name, dob, gender, phone, address } = req.body; // Get updated fields from the request body

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email }, // Find user by email
            { username, name, dob, gender, phone, address }, // Update the fields
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser); // Return the updated user details
    } catch (error) {
        console.error('Error updating user profile:', error); // Log error for better debugging
        res.status(500).json({ message: 'Error updating user profile' });
    }
});


// Update a ticket's assignee
router.put('/tickets/:id', async (req, res) => {
    const { id } = req.params;
    const { assignee, status } = req.body; // You might want to also update the status

    try {
        const ticket = await Ticket.findByIdAndUpdate(id, { assignee, status }, { new: true });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json(ticket); // Return the updated ticket
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket' });
    }
});

// Get the user information by email
router.get('/user/:email', async (req, res) => {
    const { email } = req.params; // Get the email from the request params
    try {
        // Find the user by email in the database
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the full user details as a JSON response
        res.json({
            name: user.name,
            email: user.email,
            dob: user.dob,
            gender: user.gender,
            phone: user.phone,
            position: user.position,
            address: user.address
            // Add other user fields if necessary
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

//Update User status:
router.put('/user/:id/status', async (req, res) => {
    const { id } = req.params; // Get user ID from the URL
    const { status } = req.body; // Get the new status from the request body

    try {
        // Find the user by ID and update their status
        const user = await User.findByIdAndUpdate(id, { status: status }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Error updating user status' });
    }
});

// API/Route To upload product listing by email
router.post('/products', async (req, res) => {
    const { title, description, price, category, imageUrl, email } = req.body;
  
    try {
      const newProduct = new Product({
        title,
        description,
        price,
        category,
        imageUrl,
        email
      });
  
      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error('Error uploading product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// GET /api/products/user/:email - Fetch products for a specific user by email
router.get("/products/user/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const products = await Product.find({ email });
      res.json(products);
    } catch (err) {
      console.error("Error fetching user products:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// PUT /api/products/:id - Update product by ID
router.put("/products/:id", async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

// DELETE /api/products/:id - Delete product by ID
router.delete("/products/:id", async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted", id: req.params.id });
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// GET /api/products/search - Fetch and Search products with filters
router.get("/products/search", async (req, res) => {
    try {
      const { query, categories, maxPrice, page = 1, limit = 9 } = req.query;
  
      const searchFilter = query
        ? {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { category: { $regex: query, $options: "i" } }
            ]
          }
        : {};
  
      const categoryFilter = categories
        ? { category: { $in: categories.split(",") } }
        : {};
  
      const priceFilter = maxPrice ? { price: { $lt: parseFloat(maxPrice) } } : {};
  
      const filters = { ...searchFilter, ...categoryFilter, ...priceFilter };
  
      const pageNumber = parseInt(page) || 1;
      const limitNumber = parseInt(limit) || 9;
      const skip = (pageNumber - 1) * limitNumber;
  
      const products = await Product.find(filters)
        .skip(skip)
        .limit(limitNumber);
  
      const total = await Product.countDocuments(filters);
  
      res.json({
        products,
        totalPages: Math.ceil(total / limitNumber),
        currentPage: pageNumber
      });
  
    } catch (err) {
      console.error("Error filtering products:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

// GET /api/products/latest - Get latest 3 product posts
router.get("/products/latest", async (req, res) => {
    try {
      const latestProducts = await Product.find().sort({ _id: -1 }).limit(3);
      res.json(latestProducts);
    } catch (err) {
      console.error("Error fetching latest products:", err);
      res.status(500).json({ message: "Server error" });
    }
  });  

  // GET /api/products/insights - Fetch product insights
router.get("/products/insights", async (req, res) => {
    try {
      // Get total products
      const totalProducts = await Product.countDocuments();
  
      // Get product count for each category
      const categories = ["Footwear", "Top", "Bottom"];
      const categoryCounts = {};
      for (const category of categories) {
        categoryCounts[category] = await Product.countDocuments({ category });
      }
  
      // Return the insights
      res.json({
        totalProducts,
        categoryCounts
      });
    } catch (error) {
      console.error("Error fetching product insights:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET /api/products/:id - Fetch product by ID
router.get("/products/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (err) {
      console.error("Error fetching product by ID:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  


module.exports = router;
