const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const authenticate = require('../middleware/authenticate'); // Adjust path if middleware is elsewhere

// Upload Product
router.post('/products', async (req, res) => {
    const { title, description, price, category, occasion,imageUrl, seller, email, userId } = req.body;
  
    try {
      const newProduct = new Product({
        title,
        description,
        price,
        category,occasion,
        imageUrl,
        seller,
        email,
        userId
      });
  
      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get the user products
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

// Update Product
router.put("/products/:id", authenticate, async (req, res) => {
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

// Delete Product
router.delete("/products/:id", authenticate, async (req, res) => {
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

// Search Product
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

// Get latest 3 product
router.get("/products/latest", async (req, res) => {
    try {
        const latestProducts = await Product.find().sort({ _id: -1 }).limit(3);
        res.json(latestProducts);
    } catch (err) {
        console.error("Error fetching latest products:", err);
        res.status(500).json({ message: "Server error" });
    }
  });  

// Get all products
router.get("/products", async (req, res) => {
  try {
      // Fetch all products from the database
      const products = await Product.find();

      // Return the products
      res.json(products);
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Server error" });
  }
});
  // GET /api/products/:id - Fetch product by ID
 router.get("/products/:id",  async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ message: "Server error" });
  }

});

// Get product insights
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