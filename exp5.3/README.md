# E-commerce Catalog (Experiment 2.1.3)

This is a demonstration of advanced MongoDB modeling with Mongoose 7/8.

## Objectives Covered
- Created nested schemas (`variants` and `reviews` within `Product`).
- Added review and variant support.
- Performed aggregation queries (`totalStockAcrossVariants`, `averageVariantPrice`).
- Optimized with indexes (e.g., `{ category: 1, name: 1 }` and `{ "variants.sku": 1 }`).
- Implemented stock update methods (`updateStock` instance method).

## How to test
1. Make sure you have MongoDB running locally or have an Atlas cluster.
2. If using Atlas, create a `.env` file in this directory:
   `MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce_catalog`
3. Install dependencies: `npm install`
4. Run the code: `node server.js`
