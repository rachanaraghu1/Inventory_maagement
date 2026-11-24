const express = require('express');
const router = express.Router();
const Products = require('../Models/Products'); // Adjust the path if needed
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const checkRole = require('../middleware/role');

// Email transporter setup (use your real credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // replace with your email
    pass: 'your_app_password'      // replace with your app password
  }
});

// CREATE - Add a new product
router.post("/insertproduct", auth, async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode, quantity, reserved } = req.body;
  try {
    const existingProduct = await Products.findOne({ ProductBarcode, userId: req.user.userId });
    if (existingProduct) {
      return res.status(422).json({ message: "Product with this barcode already exists." });
    }
    const newProduct = new Products({
      ProductName,
      ProductPrice,
      ProductBarcode,
      quantity: quantity || 0,
      reserved: reserved || 0,
      userId: req.user.userId
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Insert Error:", err);
    res.status(500).json({ error: "Failed to insert product." });
  }
});

// READ - Get all products for the logged-in user
router.get("/products", auth, async (req, res) => {
  try {
    const allProducts = await Products.find({ userId: req.user.userId });
    res.status(200).json(allProducts);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
});

// READ - Get a single product by ID (only if it belongs to the user)
router.get("/products/:id", auth, async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Fetch by ID Error:", err);
    res.status(500).json({ error: "Failed to fetch product." });
  }
});

// UPDATE - Update a product by ID (only if it belongs to the user)
router.put("/updateproduct/:id", auth, async (req, res) => {
  const { ProductName, ProductPrice, ProductBarcode, quantity, reserved } = req.body;
  try {
    // Find the product before updating
    const productBefore = await Products.findOne({ _id: req.params.id, userId: req.user.userId });
    const updatedProduct = await Products.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ProductName, ProductPrice, ProductBarcode, quantity, reserved },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    // If quantity drops below 5 and was previously 5 or more, send notification
    if (productBefore && productBefore.quantity >= 5 && Number(quantity) < 5) {
      // Get user email
      const user = await User.findById(req.user.userId);
      if (user && user.email) {
        const mailOptions = {
          from: 'your_email@gmail.com',
          to: user.email,
          subject: 'Low Stock Alert',
          text: `The product "${ProductName}" (Barcode: ${ProductBarcode}) is low on stock. Only ${quantity} left!`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Low stock email sent:', info.response);
          }
        });
      }
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
});

// DELETE - Remove a product by ID (only if it belongs to the user)
router.delete("/deleteproduct/:id", auth, async (req, res) => {
  try {
    const deletedProduct = await Products.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

// Register
router.post('/auth/register', async (req, res) => {
  const { email, password, businessName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, businessName });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token, email: user.email, businessName: user.businessName });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Example: Only admins can get all users
router.get('/users', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete a user (admin only)
router.delete('/users/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

// Get all products from all users (admin only)
router.get('/all-products', auth, checkRole(['admin']), async (req, res) => {
  try {
    const allProducts = await Products.find({});
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all products." });
  }
});

// Change a user's role (admin only)
router.put('/users/:id/role', auth, checkRole(['admin']), async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user role." });
  }
});

module.exports = router;
