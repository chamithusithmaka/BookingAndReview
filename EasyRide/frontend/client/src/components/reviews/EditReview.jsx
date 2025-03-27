import React, { useState } from "react";
import StarRating from "./StarRating"; // Import the StarRating component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faStar, 
  faPencilAlt, 
  faSave, 
  faTimes,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

const EditReviewPopup = ({ review, updatedReview, setUpdatedReview, onSave, onCancel }) => {
  const [saving, setSaving] = useState(false);
  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  
  const handleRatingChange = (rating) => {
    setUpdatedReview({ ...updatedReview, rating });
  };
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-review-container">
      <div className="mb-4 pb-3 border-bottom">
        <h5 className="d-flex align-items-center mb-0">
          <FontAwesomeIcon icon={faPencilAlt} className="text-primary me-2" />
          Edit Your Review
        </h5>
        <p className="text-muted small mt-2 mb-0">
          Update your rating and feedback below
        </p>
      </div>
      
      <div className="mb-4">
        <label className="form-label fw-bold mb-3">
          <FontAwesomeIcon icon={faStar} className="text-warning me-2" />
          Your Rating
        </label>
        
        <div className="d-flex flex-column">
          <div className="stars-container mb-2">
            <StarRating rating={updatedReview.rating} onRatingChange={handleRatingChange} />
          </div>
          
          {updatedReview.rating > 0 && (
            <small className="text-primary fw-bold">
              {ratingLabels[updatedReview.rating - 1]}
            </small>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="form-label fw-bold mb-2">
          <FontAwesomeIcon icon={faPencilAlt} className="text-primary me-2" />
          Your Feedback
        </label>
        <textarea
          className="form-control form-control-lg"
          rows="4"
          placeholder="Share your experience with this vehicle..."
          value={updatedReview.reviewText}
          onChange={(e) => setUpdatedReview({ ...updatedReview, reviewText: e.target.value })}
        ></textarea>
      </div>
      
      <div className="d-flex justify-content-end gap-3">
        <button 
          className="btn btn-outline-secondary px-4" 
          onClick={onCancel}
          disabled={saving}
        >
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Cancel
        </button>
        <button 
          className="btn btn-primary px-4" 
          onClick={handleSave}
          disabled={saving || updatedReview.rating === 0 || !updatedReview.reviewText.trim()}
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="me-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default EditReviewPopup;