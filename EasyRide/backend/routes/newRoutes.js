import express from "express";
import Booking from "../models/booking.model.js";
import Review from "../models/review.model.js";
import Cancel from "../models/cancel.model.js";
import Notification from "../models/notification.model.js";
import Vehicle from "../models/vehicle.model.js";

const router = express.Router();

//http://localhost:5000/api/booking/createBooking
//create booking 
router.post("/createBooking", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ message: "Booking created successfully.", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking.", error: error.message });
  }
});

//http://localhost:5000/api/booking/completed/:userId
// Fetch completed bookings by userId
router.get("/completed/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const completedBookings = await Booking.find({ userId, status: "completed" });
      res.status(200).json(completedBookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completed bookings.", error: error.message });
    }
  });

  // Create a review
  //http://localhost:5000/api/booking/createReview
router.post("/createReview", async (req, res) => {
    try {
      const { userId, vehicleId, bookingId, rating, reviewText } = req.body;
  
      // Check if the booking exists and is completed
      const booking = await Booking.findOne({ _id: bookingId, status: "completed" });
      if (!booking) {
        return res.status(400).json({ message: "Review can only be created for completed bookings." });
      }
  
      // Create the review
      const review = await Review.create({ userId, vehicleId, bookingId, rating, reviewText });
      res.status(201).json({ message: "Review created successfully.", review });
    } catch (error) {
      res.status(500).json({ message: "Failed to create review.", error: error.message });
    }
  });

// Cancel an order
// http://localhost:5000/api/booking/cancelBooking
router.post("/cancelBooking", async (req, res) => {
    try {
      const { userId, bookingId, cancellationReason, refundAmount, bankDetails } = req.body;
  
      // Check if the booking exists
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found." });
  
      // Create a cancellation record
      const cancellation = await Cancel.create({
        userId,
        bookigId: bookingId, // Note: Typo in your schema, should be "bookingId"
        cancellationReason,
        refundAmount,
        bankDetails,
      });
  
      // Update the booking status to "canceled"
      booking.status = "canceled";
      await booking.save();
  
      res.status(201).json({ message: "Order cancelled successfully.", cancellation });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel order.", error: error.message });
    }
  });

// Fetch all bookings
// http://localhost:5000/api/booking/allBookings
router.get("/allBookings", async (req, res) => {
    try {
      const bookings = await Booking.find(); // Fetch all bookings
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings.", error: error.message });
    }
  });

// Create a notification
// http://localhost:5000/api/createNotification
router.post("/createNotification", async (req, res) => {
  try {
    const { userId, message, type } = req.body;

    // Create the notification
    const notification = await Notification.create({ userId, message, type });
    res.status(201).json({ message: "Notification created successfully.", notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to create notification.", error: error.message });
  }
});

// Get all vehicles
// http://localhost:5000/api/booking/vehicles
router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find(); // Fetch all vehicles from the database
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch vehicles.", error: error.message });
  }
});

export default router;