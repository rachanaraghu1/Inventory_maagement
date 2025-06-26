const express = require('express');
const router = express.Router();
const Products = require('../Models/Products'); // Adjust the path if needed

// CREATE - Add a new product
router.post("/insertproduct", async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode } = req.body;

  try {
    const existingProduct = await Products.findOne({ ProductBarcode });

    if (existingProduct) {
      return res.status(422).json({ message: "Product with this barcode already exists." });
    }

    const newProduct = new Products({ ProductName, ProductPrice, ProductBarcode });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Failed to insert product." });
  }
});

// READ - Get all products
router.get("/products", async (req, res) => {
  try {
    const allProducts = await Products.find({});
    res.status(200).json(allProducts);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// READ - Get a single product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Fetch by ID Error:", err);
    res.status(500).json({ error: "Failed to fetch product." });
  }
});

// UPDATE - Update a product by ID
router.put("/updateproduct/:id", async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode } = req.body;

  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params.id,
      { ProductName, ProductPrice, ProductBarcode },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
});

// DELETE - Remove a product by ID
router.delete("/deleteproduct/:id", async (req, res) => {
  try {
    const deletedProduct = await Products.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

module.exports = router;
