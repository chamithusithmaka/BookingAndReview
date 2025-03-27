import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faStar, 
  faEdit, 
  faSpinner, 
  faComments,
  faExclamationCircle,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import EditReviewPopup from "./EditReview"; // Import the edit review component

const MyReviews = ({ bookingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null); // State for the review being edited
  const [updatedReview, setUpdatedReview] = useState({ rating: 0, reviewText: "" }); // State for the updated review
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // State for confirming deletion

  // Fetch reviews by booking ID
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/reviews/${bookingId}`);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
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
      setDeleteConfirmation(null); // Close the confirmation dialog
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

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <FontAwesomeIcon icon={faSpinner} spin className="text-primary mb-3" size="2x" />
        <p className="text-muted">Loading your reviews...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center">
        <FontAwesomeIcon icon={faComments} className="text-secondary mb-3" size="3x" opacity="0.6" />
        <h5 className="text-muted">No Reviews Yet</h5>
        <p className="text-muted small">You haven't submitted any reviews for this booking.</p>
      </div>
    );
  }

  return (
    <div>
      <h5 className="mb-4 d-flex align-items-center">
        <FontAwesomeIcon icon={faComments} className="text-primary me-2" />
        Your Reviews
      </h5>
      
      <div className="review-list">
        {reviews.map((review) => (
          <div 
            key={review._id} 
            className="card border-0 shadow-sm mb-3 hover-shadow transition-all"
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="stars-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStar}
                        className={star <= review.rating ? "text-warning" : "text-secondary"}
                        style={{ marginRight: "2px" }}
                      />
                    ))}
                  </div>
                  <span className="badge bg-light text-dark ms-2">
                    {review.rating}/5
                  </span>
                </div>
                
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => handleEditReview(review)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger" 
                    onClick={() => setDeleteConfirmation(review._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-1" />
                    Delete
                  </button>
                </div>
              </div>
              
              <p className="review-text mb-3">
                {review.reviewText}
              </p>
              
              <div className="d-flex align-items-center text-muted small">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                <span>Submitted on: {formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Review Popup - Fixed non-transparent modal */}
      {editingReview && (
        <>
          {/* Dark overlay with opacity */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1040
            }}
            onClick={() => setEditingReview(null)}
          ></div>
          
          {/* Modal dialog */}
          <div className="modal d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered shadow-lg">
              <div className="modal-content bg-white">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit Your Review
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setEditingReview(null)}
                  ></button>
                </div>
                <div className="modal-body p-4 bg-white">
                  <EditReviewPopup
                    review={editingReview}
                    updatedReview={updatedReview}
                    setUpdatedReview={setUpdatedReview}
                    onSave={handleUpdateReview}
                    onCancel={() => setEditingReview(null)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal - Also fixed for consistency */}
      {deleteConfirmation && (
        <>
          {/* Dark overlay with opacity */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1040
            }}
            onClick={() => setDeleteConfirmation(null)}
          ></div>
          
          {/* Modal dialog */}
          <div className="modal d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered shadow-lg">
              <div className="modal-content bg-white">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                    Delete Review
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setDeleteConfirmation(null)}
                  ></button>
                </div>
                <div className="modal-body p-4 bg-white">
                  <p>Are you sure you want to delete this review? This action cannot be undone.</p>
                </div>
                <div className="modal-footer bg-white">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setDeleteConfirmation(null)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => handleDeleteReview(deleteConfirmation)}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyReviews;