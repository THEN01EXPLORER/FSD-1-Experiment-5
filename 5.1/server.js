require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
let mongoServer;

async function startServer() {
    // Start the in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to In-Memory MongoDB...');

        // Start the server ONLY after successful DB connection
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Could not connect to MongoDB...', err);
        process.exit(1);
    }
}

startServer();

// Routes

// 1. Create a Product
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 2. Read all Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort('-createdAt');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Read a single Product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});

// 4. Update a Product
app.put('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. Delete a Product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully', product });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});
