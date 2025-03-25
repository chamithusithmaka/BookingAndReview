import React from 'react';

const ReviewCard = ({ review }) => {
  const { userId, rating, reviewText, createdAt } = review;

  // Format the created date
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="review-card">
        <h4>Rating: {review.rating} / 5</h4>
        <p>{review.reviewText}</p>
      <div className="review-header">
        <div className="user-info">
          <span className="user-name">{userId.name}</span>
          <span className="review-date">{formattedDate}</span>
        </div>
        <div className="rating">
          {/* Display stars based on the rating */}
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < rating ? "filled" : "empty"}>★</span>
          ))}
        </div>
      </div>
      <div className="review-text">
        <p>{reviewText}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
