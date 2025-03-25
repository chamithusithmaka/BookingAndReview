import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MyReviews from "../reviews/MyReviews";
import ReviewForm from "../reviews/ReviewForm"; // Import the ReviewForm component

const BookingDetail = () => {
  const { id } = useParams(); // Get booking ID from the URL
  const [booking, setBooking] = useState(null); // Initialize booking as null
  const [loading, setLoading] = useState(true); // Loading state
  const [hasReview, setHasReview] = useState(false); // State to track if the user has already submitted a review

  // Fetch booking by ID
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${id}`);
        setBooking(response.data.booking); // Extract the booking object from the response
        setHasReview(response.data.booking.hasReview); // Check if the booking already has a review
        setLoading(false); // Stop loading
        console.log(response.data.booking);
      } catch (error) {
        console.error("Error fetching booking:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return <p className="text-center text-muted">Loading booking details...</p>;
  }

  if (!booking) {
    return <p className="text-center text-danger">Booking not found.</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 display-5">Booking Details</h1>

      {/* Horizontal Layout */}
      <div className="row g-4">
        {/* Booking Details Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h2 className="card-title h4 mb-3">{booking.name}</h2>
              <p className="card-text">
                <strong>Vehicle ID:</strong> {booking.vehicleId}
              </p>
              <p className="card-text">
                <strong>User ID:</strong> {booking.userId}
              </p>
              <p className="card-text">
                <strong>Pickup Date:</strong> {new Date(booking.pick_up_date).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Return Date:</strong> {new Date(booking.return_date).toLocaleDateString()}
              </p>
              <p className="card-text">
                <strong>Status:</strong> {booking.status}
              </p>
              <p className="card-text">
                <strong>Total Price:</strong> ${booking.total_price}
              </p>
              <p className="card-text">
                <strong>Additional Notes:</strong> {booking.additional_notes}
              </p>
            </div>
          </div>
        </div>

        {/* Review Form Section */}
        <div className="col-12 col-md-6 col-lg-4">
          {booking.status === "completed" ? (
            hasReview ? (
              <div className="card shadow-lg h-100">
                <div className="card-body text-center">
                  <p className="text-success">You have already submitted a review for this booking.</p>
                </div>
              </div>
            ) : (
              <div className="card shadow-lg h-100">
                <div className="card-body">
                  <h3 className="card-title h5 mb-3">Submit a Review</h3>
                  <ReviewForm
                    userId={booking.userId}
                    vehicleId={booking.vehicleId}
                    bookingId={booking._id}
                  />
                </div>
              </div>
            )
          ) : booking.status === "canceled" ? (
            <div className="card shadow-lg h-100">
              <div className="card-body text-center">
                <p className="text-danger">
                  Reviews cannot be submitted for canceled bookings.
                </p>
              </div>
            </div>
          ) : (
            <div className="card shadow-lg h-100">
              <div className="card-body text-center">
                <p className="text-muted">
                  Reviews can only be submitted for completed bookings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* My Reviews Section */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-lg h-100">
            <div className="card-body">
              <h3 className="card-title h5 mb-3">My Reviews</h3>
              <MyReviews bookingId={booking._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;