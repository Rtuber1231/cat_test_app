const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// IMPORTANT: Adjust the path to your route files
// Since index.js is now in /api, we need to go up one level
const testRoutes = require('../routes/testRoutes');
const resultRoutes = require('../routes/resultRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch(err => console.error('Connection error:', err));

// API Routes
app.use('/api/test', testRoutes);
app.use('/api/results', resultRoutes);

// Test route (this will be accessible at /api)
app.get('/api', (req, res) => {
  res.send('Backend server is live!');
});

// DO NOT INCLUDE app.listen(...)

// Export the app for Vercel
module.exports = app;
