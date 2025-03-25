import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar } from "@fortawesome/free-solid-svg-icons";

const MyReviews = ({ bookingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews by booking ID
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reviews/${bookingId}`);
        setReviews(response.data.reviews || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [bookingId]);

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId)); // Remove the deleted review from the state
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-muted">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-center text-muted">No reviews available for this booking.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-center mb-4">Reviews</h2>
      <div className="row g-3">
        {reviews.map((review) => (
          <div key={review._id} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    {/* Display stars based on the rating */}
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={star <= review.rating ? "text-warning" : "text-secondary"}
                      />
                    ))}
                  </div>
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger cursor-pointer"
                    onClick={() => handleDeleteReview(review._id)}
                    title="Delete Review"
                  />
                </div>
                <p className="mb-1">
                  <strong>Review:</strong> {review.reviewText}
                </p>
                <p className="text-muted mb-0">
                  <small>Submitted on: {new Date(review.createdAt).toLocaleDateString()}</small>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;