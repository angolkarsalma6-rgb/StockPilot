const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const jwt = require('jsonwebtoken');

// Auth middleware
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// POST record a sale
router.post('/', auth, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Find the product
    const product = await Product.findOne({ where: { id: product_id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if enough stock
    if (product.stock_qty < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    // Calculate total
    const total = product.price * quantity;

    // Record the transaction
    const transaction = await Transaction.create({
      product_id,
      quantity,
      unit_price: product.price,
      total
    });

    // Decrement stock
    const new_stock = product.stock_qty - quantity;
    await Product.update(
      { stock_qty: new_stock },
      { where: { id: product_id } }
    );

    // Check if stock is below threshold → create alert
    if (new_stock <= product.low_stock_threshold) {
      // Only create alert if one doesn't already exist
      const existingAlert = await Alert.findOne({
        where: { product_id, acknowledged: false }
      });
      if (!existingAlert) {
        await Alert.create({
          product_id,
          product_name: product.name,
          current_stock: new_stock
        });
      }
    }

    res.json({
      message: 'Sale recorded successfully',
      transaction,
      remaining_stock: new_stock
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all transactions
router.get('/', auth, async (req, res) => {
  const transactions = await Transaction.findAll({ order: [['createdAt', 'DESC']] });
  res.json(transactions);
});

module.exports = router;