import React from "react";
import StarRating from "./StarRating"; // Import the StarRating component

const EditReviewPopup = ({ review, updatedReview, setUpdatedReview, onSave, onCancel }) => {
  const handleRatingChange = (rating) => {
    setUpdatedReview({ ...updatedReview, rating });
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg" style={{ width: "400px" }}>
        <h5 className="mb-3">Edit Review</h5>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <div>
            <StarRating rating={updatedReview.rating} onRatingChange={handleRatingChange} />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Review</label>
          <textarea
            className="form-control"
            rows="4"
            value={updatedReview.reviewText}
            onChange={(e) => setUpdatedReview({ ...updatedReview, reviewText: e.target.value })}
          ></textarea>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReviewPopup;