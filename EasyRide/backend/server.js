import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectDB } from './config/db.js';

// Import routes
import userRoutes from './routes/user.route.js';
import bookingRoutes from './routes/booking.route.js';
import reviewRoutes from './routes/review.route.js'; 
import cancelRoutes from "./routes/cancel.routes.js";
import loginRoute from "./routes/login.js";
import vehicleRoutes from './routes/vehicle.route.js'; 
import NewRoutes from './routes/newRoutes.js';
import refundRoutes from './routes/refundRoutes.js'; // Import the refund routes
import emailRoutes from './routes/emailRoutes.js'; // Updated to ES module import
dotenv.config();

const app = express(); // Initialize the app
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded payload limit


app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
connectDB();

// Define routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use("/api/cancel", cancelRoutes);
app.use('/api/booking', NewRoutes);
app.use('/api/refunds', refundRoutes); // Route for refunds
app.use('/api/email', emailRoutes);
// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the EasyRide API!');
});

const PORT = process.env.PORT || 5000; 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});