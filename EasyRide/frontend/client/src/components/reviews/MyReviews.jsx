import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditReviewPopup from "./EditReview"; // Import the new component

const MyReviews = ({ bookingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null); // State for the review being edited
  const [updatedReview, setUpdatedReview] = useState({ rating: 0, reviewText: "" }); // State for the updated review

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

  // Open the edit popup
  const handleEditReview = (review) => {
    setEditingReview(review);
    setUpdatedReview({ rating: review.rating, reviewText: review.reviewText });
  };

  // Update the review
  const handleUpdateReview = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/booking/reviews/${editingReview._id}`, updatedReview);
      setReviews(
        reviews.map((review) =>
          review._id === editingReview._id ? response.data.updatedReview : review
        )
      );
      setEditingReview(null); // Close the popup
    } catch (error) {
      console.error("Error updating review:", error);
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
                  <div className="d-flex gap-2">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-primary cursor-pointer"
                      onClick={() => handleEditReview(review)}
                      title="Edit Review"
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-danger cursor-pointer"
                      onClick={() => handleDeleteReview(review._id)}
                      title="Delete Review"
                    />
                  </div>
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

      {/* Edit Review Popup */}
      {editingReview && (
        <EditReviewPopup
          review={editingReview}
          updatedReview={updatedReview}
          setUpdatedReview={setUpdatedReview}
          onSave={handleUpdateReview}
          onCancel={() => setEditingReview(null)}
        />
      )}
    </div>
  );
};

export default MyReviews;