const mongoose = require('mongoose');
const express = require('express');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Vercel handles start logic for serverless functions,
// but we need to ensure mongoose connects when the function is hit.
let isConnected = false;

async function setupDatabase() {
    if (isConnected) {
        return;
    }

    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        throw new Error("Please define the MONGO_URI environment variable");
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB Atlas.\n');

    // Clean up existing data to recreate it cleanly every time for the demo
    await Product.deleteMany({});

    const userIdObj = new mongoose.Types.ObjectId("65f4a8b7c1e6a8c1f4b8c7d1");

    const productsToInsert = [
        {
            name: "T-Shirt",
            category: "Clothing",
            variants: [
                { sku: "12345-5", color: "red", price: 19.99, stock: 0 }
            ],
            avgRating: 4.5
        },
        {
            name: "Headphones",
            category: "Electronic",
            variants: [
                { sku: "98765-B", color: "Black", price: 35.99, stock: 2 }
            ],
            avgRating: 3.75
        },
        {
            name: "Premium Headphones",
            category: "Electronics",
            variants: [
                { sku: "HP-BL-001", color: "Black", price: 199.99, stock: 15 },
                { sku: "HP-WH-001", color: "White", price: 209.99, stock: 8 }
            ],
            reviews: [
                {
                    userId: userIdObj,
                    rating: 5,
                    comment: "Excellent sound quality"
                }
            ],
            avgRating: 5
        },
        {
            name: "Microwave",
            category: "Appliances",
            variants: [
                { sku: "MW-001", color: "Silver", price: 120.00, stock: 5 }
            ],
            avgRating: null
        }
    ];

    await Product.insertMany(productsToInsert);
    console.log('--- Initial Data Seeded ---');

    // Perform a test stock update method to match the desired final stock numbers
    const premiumHeadphones = await Product.findOne({ name: "Premium Headphones" });
    if (premiumHeadphones) {
        await premiumHeadphones.updateStock("HP-BL-001", -2); // 15 - 2 = 13
    }
    console.log('--- Stock updated successfully! ---');
}

// Serve the final formatted JSON output
app.get('/', async (req, res) => {
    try {
        // Query 1: Low stock products (stock < 5)
        const lowStockProducts = await Product.aggregate([
            { $unwind: "$variants" },
            { $match: { "variants.stock": { $lt: 5 } } },
            {
                $project: {
                    name: 1,
                    "variants.sku": 1,
                    "variants.color": 1,
                    "variants.price": 1,
                    "variants.stock": 1
                }
            }
        ]);

        // Query 2: Category Ratings
        const caetegoryRatings = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    avgCategoryRating: { $avg: "$avgRating" }
                }
            },
            {
                // To get Electronic before Clothing before Appliances, we can sort by id reversed or something, 
                // but we will simply return the array
                $sort: { avgCategoryRating: -1 }
            }
        ]);

        res.json({
            lowStockProducts,
            caetegoryRatings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the application locally or export for Vercel
if (process.env.NODE_ENV !== 'production') {
    setupDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running! Open http://localhost:${PORT} in your browser.`);
        });
    }).catch(err => {
        console.error('Failed to start server:', err);
    });
} else {
    // In production (Vercel), we initialize DB on every request if it isn't already
    app.use(async (req, res, next) => {
        try {
            await setupDatabase();
            next();
        } catch (error) {
            res.status(500).json({ error: "Database Connection Failed: " + error.message });
        }
    });
}

module.exports = app;

