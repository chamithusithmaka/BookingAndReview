import React, { useState } from "react";
import axios from "axios";
import StarRating from "./StarRating"; // Import the StarRating component

const ReviewForm = ({ userId, vehicleId, bookingId }) => {
  const [review, setReview] = useState({ rating: 0, reviewText: "" }); // Review state
  const [message, setMessage] = useState(""); // Message for success or error

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/booking/createReview", {
        userId,
        vehicleId,
        bookingId,
        rating: review.rating,
        reviewText: review.reviewText,
      });
      setMessage("Review submitted successfully!");
      setReview({ rating: 0, reviewText: "" }); // Reset the form
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review.");
    }
  };

  const handleRatingChange = (rating) => {
    setReview({ ...review, rating });
  };

  return (
    <div className="mt-4 mx-auto" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Leave a Review</h2>
      {message && (
        <p
          className={`text-center ${
            message.includes("successfully") ? "text-success" : "text-danger"
          } mb-4`}
        >
          {message}
        </p>
      )}
      <form onSubmit={handleReviewSubmit}>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <div>
            <StarRating rating={review.rating} onRatingChange={handleRatingChange} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Review</label>
          <textarea
            value={review.reviewText}
            onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
            className="form-control"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;