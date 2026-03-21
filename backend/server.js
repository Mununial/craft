const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection (Placeholder/Mock logic for now if no DB URI is supplied)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/art_handcraft';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connection established successfully'))
  .catch(err => console.log('MongoDB connection error. (Mocking DB for layout purposes):', err.message));

// Basic API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Fallback to index.html for SPA-like behavior or deep links
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Visit http://localhost:${PORT} in your browser.`);
});
