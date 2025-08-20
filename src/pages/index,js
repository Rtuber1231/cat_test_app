const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const testRoutes = require('./routes/testRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/test', testRoutes);
app.use('/api/results', resultRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is live!');
});

// Function to start the server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas!');
    
    // This part is for traditional servers like Railway or Replit
    // Vercel will ignore this and use the export statement below
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1); // Exit the process with an error code
  }
};

// Start the server
startServer();

// Export the app for serverless environments like Vercel
module.exports = app;
