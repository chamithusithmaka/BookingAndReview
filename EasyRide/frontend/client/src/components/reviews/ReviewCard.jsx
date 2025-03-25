import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewCard = ({ review }) => {
  const { userId, rating, reviewText, createdAt } = review;

  // Format the created date
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h5 className="card-title mb-1">{userId.name}</h5>
            <small className="text-muted">{formattedDate}</small>
          </div>
          <div className="d-flex">
            {/* Display stars based on the rating */}
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={faStar}
                className={star <= rating ? "text-warning" : "text-secondary"}
              />
            ))}
          </div>
        </div>
        <p className="card-text">{reviewText}</p>
      </div>
    </div>
  );
};

export default ReviewCard;