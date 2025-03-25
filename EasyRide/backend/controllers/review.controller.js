import Review from "../models/review.model.js";
import Vehicle from '../models/vehicle.model.js';  
import Booking from "../models/booking.model.js";
import mongoose from "mongoose";

// Add a new review
export const addReview = async (req, res) => {
  const { vehicleId, rating, reviewText } = req.body;  
  const userId = req.user._id;

  try {
    // Input validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    if (!reviewText || reviewText.trim().length === 0) {
      return res.status(400).json({ message: "Review text cannot be empty." });
    }

    // Check if the user has completed a booking for the vehicle
    const booking = await Booking.findOne({ userId, vehicleId, status: 'completed' });
    if (!booking) {
      return res.status(403).json({ message: "Only users who have completed a booking can leave a review." });
    }

    const review = new Review({ userId, vehicleId, rating, reviewText });
    await review.save();

    // Update the vehicle's average rating
    const vehicle = await Vehicle.findById(vehicleId);
    vehicle.totalRating += rating;
    vehicle.reviewCount += 1;
    vehicle.averageRating = vehicle.totalRating / vehicle.reviewCount;
    await vehicle.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit an existing review
export const editReview = async (req, res) => {
  const { rating, reviewText } = req.body;

  try {
    // Input validation
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }
    if (!reviewText || reviewText.trim().length === 0) {
      return res.status(400).json({ message: "Review text cannot be empty." });
    }

    // Check if the review exists and if the user owns it
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (!review.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own review" });
    }

    // Update rating and review text
    const oldRating = review.rating;
    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();

    // Update the vehicle's average rating
    const vehicle = await Vehicle.findById(review.vehicleId);
    vehicle.totalRating += (rating - oldRating); // Adjust for the rating change
    vehicle.averageRating = vehicle.totalRating / vehicle.reviewCount;
    await vehicle.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an existing review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Review ID is required" });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all reviews for a vehicle with sorting, filtering by rating, and pagination
export const getVehicleReviews = async (req, res) => {
  try {
    const { sortBy, rating, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    let sortOption = { createdAt: -1 };  // Default: latest first
    let filter = { vehicleId: req.params.vehicleId };

    // Apply filtering by rating if provided
    if (rating) {
      filter.rating = Number(rating);
    }

    // Apply sorting options
    if (sortBy === "highest") {
      sortOption = { rating: -1 };
    } else if (sortBy === "lowest") {
      sortOption = { rating: 1 };
    }

    const reviews = await Review.find(filter)
      .populate("userId", "name email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(filter);

    res.status(200).json({ 
      reviews,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReviewsByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const reviews = await Review.find({ bookingId });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch reviews.", error: error.message });
  }
};