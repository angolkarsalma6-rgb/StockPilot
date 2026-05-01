const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware to verify token
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

// GET all products
router.get('/', auth, async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// POST add product
router.post('/', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update product
router.put('/:id', auth, async (req, res) => {
  await Product.update(req.body, { where: { id: req.params.id } });
  res.json({ message: 'Product updated' });
});

// DELETE product
router.delete('/:id', auth, async (req, res) => {
  await Product.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Product deleted' });
});

module.exports = router;