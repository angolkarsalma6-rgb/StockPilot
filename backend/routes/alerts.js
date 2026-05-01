const express = require('express');
const router = express.Router();
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

// GET all unacknowledged alerts
router.get('/', auth, async (req, res) => {
  const alerts = await Alert.findAll({
    where: { acknowledged: false },
    order: [['createdAt', 'DESC']]
  });
  res.json(alerts);
});

// PUT acknowledge an alert
router.put('/:id/acknowledge', auth, async (req, res) => {
  await Alert.update(
    { acknowledged: true },
    { where: { id: req.params.id } }
  );
  res.json({ message: 'Alert acknowledged' });
});

module.exports = router;