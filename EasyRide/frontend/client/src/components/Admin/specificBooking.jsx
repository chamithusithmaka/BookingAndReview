import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SpecificBooking = () => {
  const { id } = useParams(); // Get booking ID from the URL
  const [booking, setBooking] = useState(null); // Initialize booking as null
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch booking by ID
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${id}`);
        setBooking(response.data.booking); // Extract the booking object from the response
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching booking:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchBooking();
  }, [id]);

  // Handle marking the booking as completed
  const handleCompleteBooking = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/booking/complete/${id}`);
      setBooking(response.data.booking); // Update the booking state with the completed booking
      alert("Booking marked as completed successfully.");
    } catch (error) {
      console.error("Error completing booking:", error);
      alert("Failed to mark booking as completed. Please try again.");
    }
  };

  if (loading) {
    return <p className="text-center text-muted">Loading booking details...</p>;
  }

  if (!booking) {
    return <p className="text-center text-danger">Booking not found.</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 display-5">Booking Details</h1>
      <div className="card shadow-lg">
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
          {booking.status === "canceled" && (
            <p className="card-text">
              <strong>Cancellation Reason:</strong> {booking.cancellationReason}
            </p>
          )}
          {booking.status === "canceled" && booking.canceledAt && (
            <p className="card-text">
              <strong>Canceled At:</strong> {new Date(booking.canceledAt).toLocaleDateString()}
            </p>
          )}
          {booking.status === "pending" && (
            <button
              className="btn btn-success mt-3"
              onClick={handleCompleteBooking}
            >
              Mark as Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificBooking;