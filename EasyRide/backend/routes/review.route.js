import express from 'express';
import { addReview, editReview, deleteReview, getVehicleReviews,getReviewsByBookingId } from '../controllers/review.controller.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post("/reviews", isAuthenticated, addReview);
router.put("/reviews/:id", isAuthenticated, editReview);
router.delete("/reviews/:id", isAuthenticated, deleteReview);
router.get("/reviews/:vehicleId", getVehicleReviews);
// Fetch all reviews by booking ID
router.get("/:bookingId", getReviewsByBookingId);

export default router;
