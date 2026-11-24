const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema(
    {
        ProductName: {
            type: String,
            required: true,
        },
        ProductPrice: {
            type: Number,
            required: true,
        },
        ProductBarcode: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        reserved: {
            type: Number,
            required: true,
            default: 0,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        imageUrl: {
            type: String,
            required: false,
        },
    });

const Products = mongoose.model("Products", ProductSchema)
module.exports = Products;
