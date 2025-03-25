import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) {
    return <p className="text-center text-gray-600">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-center text-gray-600">No reviews available for this booking.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border border-gray-300 rounded-lg shadow-lg bg-white p-4"
          >
            <p className="text-gray-600"><strong>Rating:</strong> {review.rating} / 5</p>
            <p className="text-gray-600"><strong>Review:</strong> {review.reviewText}</p>
            <p className="text-gray-400 text-sm">Submitted on: {new Date(review.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyReviews;