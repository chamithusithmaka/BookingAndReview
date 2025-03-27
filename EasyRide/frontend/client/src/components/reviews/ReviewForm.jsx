import React, { useState } from "react";
import axios from "axios";
import StarRating from "./StarRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faCheckCircle, 
  faExclamationTriangle, 
  faPencilAlt,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const ReviewForm = ({ userId, vehicleId, bookingId }) => {
  const [review, setReview] = useState({ rating: 0, reviewText: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (review.rating === 0) {
      setMessage("Please select a rating before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
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
      setMessage("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating) => {
    setReview({ ...review, rating });
    if (message) setMessage(""); // Clear any previous messages
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="review-form-container">
      {message && (
        <div 
          className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"} d-flex align-items-center mb-4`}
          role="alert"
        >
          <FontAwesomeIcon 
            icon={message.includes("successfully") ? faCheckCircle : faExclamationTriangle}
            className="me-2"
          />
          <div>{message}</div>
        </div>
      )}
      
      <form onSubmit={handleReviewSubmit}>
        <div className="mb-4">
          <label className="form-label fw-bold mb-3">
            <FontAwesomeIcon icon={faStar} className="text-warning me-2" />
            Your Rating
          </label>
          
          <div className="d-flex flex-column">
            <div className="stars-container mb-2">
              <StarRating rating={review.rating} onRatingChange={handleRatingChange} />
            </div>
            
            {review.rating > 0 && (
              <small className="text-primary fw-bold">
                {ratingLabels[review.rating - 1]}
              </small>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-bold mb-2">
            <FontAwesomeIcon icon={faPencilAlt} className="text-primary me-2" />
            Your Review
          </label>
          <textarea
            value={review.reviewText}
            onChange={(e) => setReview({ ...review, reviewText: e.target.value })}
            className="form-control form-control-lg"
            placeholder="Share your experience with this vehicle..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg py-2"
            disabled={isSubmitting || review.rating === 0}
          >
            {isSubmitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;