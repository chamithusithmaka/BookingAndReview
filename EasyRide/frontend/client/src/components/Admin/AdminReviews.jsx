import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faStar, faFilter, faSpinner, faComments } from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);

  // Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/booking/reviews");
        const fetchedReviews = response.data.reviews || [];
        setReviews(fetchedReviews);
        setFilteredReviews(fetchedReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
        const updatedReviews = reviews.filter((review) => review._id !== reviewId);
        setReviews(updatedReviews);
        
        // Update filtered reviews as well
        if (selectedRating) {
          setFilteredReviews(updatedReviews.filter(review => review.rating === selectedRating));
        } else {
          setFilteredReviews(updatedReviews);
        }
        
        alert("Review deleted successfully.");
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  // Handle filtering by star rating
  const handleStarClick = (rating) => {
    setSelectedRating(rating);

    if (rating === null) {
      // If no rating is selected, show all reviews
      setFilteredReviews(reviews);
    } else {
      // Filter reviews by the selected rating
      const filtered = reviews.filter((review) => review.rating === rating);
      setFilteredReviews(filtered);
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container py-5">
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            <FontAwesomeIcon icon={faSpinner} spin className="text-primary mb-3" size="3x" />
            <p className="text-muted">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div className="vh-100 bg-dark text-white position-fixed" style={{ width: "250px" }}>
      <AdminSidebar />
      </div>
      <div className="container mt-5" style={{ marginLeft: "250px" }}>
        <h1 className="display-5 fw-bold mb-4">
          <FontAwesomeIcon icon={faComments} className="text-primary me-3" />
          Manage Reviews
        </h1>
        
        {/* Star-based filtering */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title d-flex align-items-center mb-3">
              <FontAwesomeIcon icon={faFilter} className="text-primary me-2" />
              Filter by Rating
            </h5>
            
            <div className="d-flex align-items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <div 
                  key={star}
                  className={`me-3 p-2 rounded-3 ${selectedRating === star ? 'bg-primary text-white' : 'bg-light'}`}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => handleStarClick(star)}
                  title={`${star} Star Rating`}
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className={selectedRating === star ? "text-white" : "text-warning"}
                    style={{ fontSize: "1.5rem" }}
                  />
                  <span className="ms-1">{star}</span>
                </div>
              ))}
              
              {/* Reset filter button */}
              <button
                className="btn btn-outline-secondary ms-3"
                onClick={() => handleStarClick(null)}
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="alert alert-info text-center" role="alert">
            No reviews found for the selected filter.
          </div>
        ) : (
          <div className="row g-4">
            {filteredReviews.map((review) => (
              <div key={review._id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100 hover-shadow">
                  <div className="card-header bg-white border-0 pt-3">
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
                        <span className="badge bg-light text-dark ms-2">
                          {review.rating}/5
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteReview(review._id)}
                        title="Delete Review"
                      >
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="text-muted mb-2">Review Content:</h6>
                    <p className="review-text mb-3">
                      "{review.reviewText}"
                    </p>
                    
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <div className="bg-light rounded p-2">
                          <small className="text-muted d-block">User ID</small>
                          <span className="small fw-bold text-truncate d-block">{review.userId}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded p-2">
                          <small className="text-muted d-block">Vehicle ID</small>
                          <span className="small fw-bold text-truncate d-block">{review.vehicleId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted mb-0 small">
                      <small>Submitted on: {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;