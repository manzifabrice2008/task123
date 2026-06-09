require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sessionConfig = require('./config/session');
const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./utils/helpers');
const { initializeDatabase, seedDatabase } = require('./services/database');

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const saleRoutes = require('./routes/sales');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionConfig);

app.get('/', (req, res) => {
  res.json({ message: 'SRMS API is running', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await initializeDatabase();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
