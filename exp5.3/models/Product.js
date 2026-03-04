const mongoose = require('mongoose');

// Variant Schema (Nested)
const variantSchema = new mongoose.Schema({
    sku: { type: String, required: true },
    color: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 }
}, { _id: false });

// Review Schema (Nested)
const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
}, { _id: false });

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    category: { type: String, required: true },
    variants: [variantSchema],
    reviews: [reviewSchema],
    avgRating: { type: Number, default: 0 }
});

// Create compound index for optimizing category and name queries
productSchema.index({ category: 1, name: 1 });
// Index for sku to easily find a variant
productSchema.index({ "variants.sku": 1 });

// Instance Method: Implement stock update
productSchema.methods.updateStock = async function (sku, quantityChange) {
    const variant = this.variants.find(v => v.sku === sku);
    if (!variant) {
        throw new Error('Variant not found');
    }

    const newStock = variant.stock + quantityChange;
    if (newStock < 0) {
        throw new Error('Insufficient stock');
    }

    variant.stock = newStock;
    await this.save();
    return variant;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
