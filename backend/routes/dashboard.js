const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Alert = require('../models/Alert');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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

// GET dashboard summary
router.get('/summary', auth, async (req, res) => {
  try {
    // Total products
    const total_products = await Product.count();

    // Total stock value
    const products = await Product.findAll();
    const total_stock_value = products.reduce((sum, p) => {
      return sum + (p.price * p.stock_qty);
    }, 0);

    // Low stock items
    const low_stock_items = products.filter(p => p.stock_qty <= p.low_stock_threshold);

    // Total sales (all transactions)
    const transactions = await Transaction.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const total_revenue = await Transaction.findAll();
    const revenue = total_revenue.reduce((sum, t) => sum + t.total, 0);

    // Unacknowledged alerts count
    const alert_count = await Alert.count({ where: { acknowledged: false } });

    res.json({
      total_products,
      total_stock_value,
      total_revenue: revenue,
      alert_count,
      low_stock_items,
      recent_transactions: transactions
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;