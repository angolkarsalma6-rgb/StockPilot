const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

// Models
const User = require('./models/User');
const Product = require('./models/Product');
const Transaction = require('./models/Transaction');
const Alert = require('./models/Alert');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const alertRoutes = require('./routes/alerts');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'StockPilot backend is running' });
});

sequelize.authenticate()
  .then(() => console.log('Database connected ✅'))
  .catch(err => console.log('Database error:', err));

sequelize.sync();

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});