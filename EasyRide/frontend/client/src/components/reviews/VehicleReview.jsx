import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faRefresh, 
  faExclamationTriangle, 
  faChevronDown, 
  faFilter, 
  faCalendar 
} from "@fortawesome/free-solid-svg-icons";

const VehicleReview = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [expandedReviewId, setExpandedReviewId] = useState(null);

  // Fetch reviews by vehicle ID
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/booking/vehicle/${vehicleId}`,
        { timeout: 10000 } // 10-second timeout
      );
      
      const fetchedReviews = response.data.reviews || [];
      
      // Sort reviews by most recent first
      const sortedReviews = fetchedReviews.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setReviews(sortedReviews);
      setFilteredReviews(sortedReviews);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message || "Failed to fetch reviews");
      setLoading(false);
    }
  }, [vehicleId]);

  // Initial fetch
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle filtering by star rating
  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setExpandedReviewId(null); // Reset expanded review

    if (rating === null) {
      // If no rating is selected, show all reviews
      setFilteredReviews(reviews);
    } else {
      // Filter reviews by the selected rating
      const filtered = reviews.filter((review) => review.rating === rating);
      setFilteredReviews(filtered);
    }
  };

  // Toggle review expansion
  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviewId(
      expandedReviewId === reviewId ? null : reviewId
    );
  };

  // Render star rating
  const StarRating = ({ rating, interactive = false, onSelect }) => (
    <div className="d-flex align-items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`
            mx-1 
            ${star <= rating 
              ? 'text-warning' 
              : 'text-secondary'}
            ${interactive ? 'cursor-pointer' : ''}
          `}
          style={{ fontSize: '1.2rem' }}
          onClick={() => interactive && onSelect(star)}
        />
      ))}
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <FontAwesomeIcon 
          icon={faRefresh} 
          className="text-primary fa-spin me-2" 
          size="2x" 
        />
        <span className="text-muted">Loading reviews...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center">
        
        <div>
          <p className="fw-bold">No Reviews Available For This Vehicle</p>
          
          
        </div>
      </div>
    );
  }

  // Render empty state
  if (reviews.length === 0) {
    return (
      <div className="text-center bg-light p-5 rounded">
        <p className="text-muted mb-3">
          No reviews available for this vehicle.
        </p>
        <button 
          onClick={fetchReviews}
          className="btn btn-primary"
        >
          <FontAwesomeIcon icon={faRefresh} className="me-2" />
          Refresh Reviews
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="text-center mb-4">Vehicle Reviews</h2>

      {/* Star-based filtering */}
      <div className="d-flex justify-content-center mb-4">
        <div className="d-flex align-items-center bg-light rounded-pill p-2 shadow-sm">
          <StarRating 
            rating={selectedRating || 0} 
            interactive={true} 
            onSelect={handleStarClick}
          />
        </div>
        
        {selectedRating && (
          <button 
            className="btn btn-link text-decoration-none ms-3 d-flex align-items-center"
            onClick={() => handleStarClick(null)}
          >
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            Reset Filter
          </button>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="row g-3">
        {filteredReviews.map((review) => (
          <div key={review._id} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <StarRating rating={review.rating} />
                  <small className="text-muted d-flex align-items-center">
                    <FontAwesomeIcon icon={faCalendar} className="me-2" />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </small>
                </div>

                <p className={`
                  card-text 
                  ${expandedReviewId === review._id 
                    ? '' 
                    : 'text-truncate'}
                `}>
                  {review.reviewText}
                </p>

                {review.reviewText.length > 200 && (
                  <button 
                    onClick={() => toggleReviewExpansion(review._id)}
                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
                  >
                    {expandedReviewId === review._id ? 'Show Less' : 'Show More'}
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className={`ms-2 ${
                        expandedReviewId === review._id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center text-muted bg-light p-3 rounded">
          No reviews found for the selected rating.
        </div>
      )}
    </div>
  );
};

export default VehicleReview;