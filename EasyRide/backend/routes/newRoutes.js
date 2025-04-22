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
    const { vehicleId, ...bookingData } = req.body;

    // Create the booking
    const booking = await Booking.create({ ...bookingData, vehicleId });

    // Update the vehicle's status to "booked"
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    if (!vehicle.availability) {
      return res.status(400).json({ message: "Vehicle is already booked." });
    }

    vehicle.status = "booked";
    vehicle.availability = false;
    await vehicle.save();

    res.status(201).json({ message: "Booking created successfully.", booking });
  } catch (error) {
    console.error("Error creating booking:", error.message);
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
  // http://localhost:5000/api/booking/createReview
  router.post("/createReview", async (req, res) => {
    try {
      const { userId, vehicleId, bookingId, rating, reviewText } = req.body;
  
      // Check if the booking exists and is completed
      const booking = await Booking.findOne({ _id: bookingId, status: "completed" });
      if (!booking) {
        return res.status(400).json({ message: "Review can only be created for completed bookings." });
      }
  
      // Check if a review already exists for this user and booking
      const existingReview = await Review.findOne({ userId, bookingId });
      if (existingReview) {
        return res.status(400).json({ message: "You have already submitted a review for this booking." });
      }
  
      // Create the review
      const review = await Review.create({ userId, vehicleId, bookingId, rating, reviewText });
      res.status(201).json({ message: "Review created successfully.", review });
    } catch (error) {
      console.error("Error creating review:", error.message);
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
// http://localhost:5000/api/booking/createNotification
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

// Fetch notifications for a user
// http://localhost:5000/api/booking/notifications/:userId
router.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications.", error: error.message });
  }
});

// Update a review
// http://localhost:5000/api/booking/reviews/:id
router.put("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;

    // Find and update the review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, reviewText },
      { new: true } // Return the updated document
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({ message: "Review updated successfully.", updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review.", error: error.message });
  }
});


// Route to cancel a booking
// http://localhost:5000/api/booking/cancel/:bookingId
router.put("/cancel/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Update the booking's status, cancellation reason, and cancellation timestamp
    booking.status = "canceled";
    booking.cancellationReason = cancellationReason;
    booking.canceledAt = new Date();
    await booking.save();

    // Update the associated vehicle's status to "Available" and set availability to true
    const vehicle = await Vehicle.findById(booking.vehicleId);
    if (vehicle) {
      vehicle.status = "Available";
      vehicle.availability = true;
      await vehicle.save();
    }

    res.status(200).json({ message: "Booking canceled successfully.", booking });
  } catch (error) {
    console.error("Error canceling booking:", error.message);
    res.status(500).json({ message: "Failed to cancel booking.", error: error.message });
  }
});

//http://localhost:5000/api/booking/vehicle/:vehicleId
// Route to fetch reviews by vehicleId
router.get("/vehicle/:vehicleId", async (req, res) => {
  try {
    const { vehicleId } = req.params;

    // Find reviews by vehicleId
    const reviews = await Review.find({ vehicleId });

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this vehicle." });
    }

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch reviews.", error: error.message });
  }
});

//http://localhost:5000/api/booking/update/:bookingId
// Route to update a booking
router.put("/update/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, pick_up_date, return_date, phone_number } = req.body;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Update fields if provided
    if (name) booking.name = name;
    if (pick_up_date) booking.pick_up_date = new Date(pick_up_date);
    if (return_date) booking.return_date = new Date(return_date);
    if (phone_number) booking.phone_number = phone_number;

    // Recalculate no_of_dates and total_price if dates are updated
    if (pick_up_date || return_date) {
      const pickUpDate = new Date(booking.pick_up_date);
      const returnDate = new Date(booking.return_date);

      if (returnDate <= pickUpDate) {
        return res.status(400).json({ message: "Return date must be after pick-up date." });
      }

      const no_of_dates = Math.ceil((returnDate - pickUpDate) / (1000 * 60 * 60 * 24));
      booking.no_of_dates = no_of_dates;

      // Fetch the vehicle to get the price per day
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Associated vehicle not found." });
      }

      booking.total_price = no_of_dates * vehicle.pricePerDay;
    }

    // Save the updated booking
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully.", booking });
  } catch (error) {
    console.error("Error updating booking:", error.message);
    res.status(500).json({ message: "Failed to update booking.", error: error.message });
  }
});

// http://localhost:5000/api/booking/complete/:bookingId
// Route to update booking status to "completed"
router.put("/complete/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find the booking by ID
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Check if the booking is already completed
    if (booking.status === "completed") {
      return res.status(400).json({ message: "Booking is already completed." });
    }

    // Update the booking status to "completed"
    booking.status = "completed";
    await booking.save();

    // Find the associated vehicle by vehicleId
    const vehicle = await Vehicle.findById(booking.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Associated vehicle not found." });
    }

    // Update the vehicle status to "Available"
    vehicle.status = "Available";
    vehicle.availability = true;
    await vehicle.save();

    res.status(200).json({
      message: "Booking marked as completed successfully, and vehicle status updated to Available.",
      booking,
      vehicle,
    });
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    res.status(500).json({ message: "Failed to update booking status.", error: error.message });
  }
});

//http://localhost:5000/api/booking/delete/:bookingId
// Route to delete a booking
router.delete("/delete/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find and delete the booking by ID
    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json({ message: "Booking deleted successfully.", booking });
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    res.status(500).json({ message: "Failed to delete booking.", error: error.message });
  }
});


// http://localhost:5000/api/booking/delete/:notificationId
// Route to delete a notification
router.delete("/deleteNotify/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find and delete the notification by ID
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.status(200).json({ message: "Notification deleted successfully.", notification });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    res.status(500).json({ message: "Failed to delete notification.", error: error.message });
  }
});

// http://localhost:5000/api/booking/all
// Route to fetch all notifications
router.get("/all", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }); // Fetch all notifications sorted by creation date (newest first)
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ message: "Failed to fetch notifications.", error: error.message });
  }
});

// Route to fetch all reviews
//http://localhost:5000/api/booking/allReviews
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Fetch all reviews sorted by creation date (newest first)
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch reviews.", error: error.message });
  }
});

//http://localhost:5000/api/booking/vehicle-details/:bookingId
// Route to fetch vehicle details by vehicleId in the booking model
// Route to fetch vehicle details by vehicleId in the booking model
router.get("/vehicle-details/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Fetch the booking by its ID and populate the vehicle details
    const booking = await Booking.findById(bookingId).populate("vehicleId");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // The vehicle details are now populated in the booking object
    const vehicle = booking.vehicleId;
    if (!vehicle) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, vehicle });
  } catch (error) {
    console.error("Error fetching vehicle details:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

export default router;