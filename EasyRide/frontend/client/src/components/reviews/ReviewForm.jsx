import React, { useState } from "react";
import axios from "axios";

const ReviewForm = ({ userId, vehicleId, bookingId }) => {
  const [review, setReview] = useState({ rating: "", reviewText: "" }); // Review state
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
      setReview({ rating: "", reviewText: "" }); // Reset the form
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review.");
    }
  };

  return (
    <div className="mt-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
      {message && <p className={`text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"} mb-4`}>{message}</p>}
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Review</label>
          <textarea
            value={review.reviewText}
            onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;