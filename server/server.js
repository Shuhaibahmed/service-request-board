/**
 * server.js
 * Entry point for the Service Board API.
 * - configures middleware
 * - connects to MongoDB
 * - mounts routes and global error handler
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Built-in middleware to parse JSON
app.use(express.json());

// Enable CORS for all origins (configure origin in production)
app.use(cors());

// Health check route
app.get('/', (req, res) => {
	res.json({ status: 'ok', message: 'Service Board API' });
});

// API routes
app.use('/api/jobs', jobRoutes);

// Global error handler (should be last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
	console.info('SIGINT received. Shutting down server.');
	server.close(() => process.exit(0));
});
