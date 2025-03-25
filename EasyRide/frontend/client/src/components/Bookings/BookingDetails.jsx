import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MyReviews from "../reviews/MyReviews";
import ReviewForm from "../reviews/ReviewForm"; // Import the ReviewForm component

const BookingDetail = () => {
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
        console.log(response.data.booking);s
      } catch (error) {
        console.error("Error fetching booking:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading booking details...</p>;
  }

  if (!booking) {
    return <p className="text-center text-red-600">Booking not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Booking Details</h1>
      <div className="border border-gray-300 rounded-lg shadow-lg bg-white p-6 max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">{booking.name}</h2>
        <p className="text-gray-600"><strong>Vehicle ID:</strong> {booking.vehicleId}</p>
        <p className="text-gray-600"><strong>User ID:</strong> {booking.userId}</p>
        <p className="text-gray-600"><strong>Pickup Date:</strong> {new Date(booking.pick_up_date).toLocaleDateString()}</p>
        <p className="text-gray-600"><strong>Return Date:</strong> {new Date(booking.return_date).toLocaleDateString()}</p>
        <p className="text-gray-600"><strong>Status:</strong> {booking.status}</p>
        <p className="text-gray-600"><strong>Total Price:</strong> ${booking.total_price}</p>
        <p className="text-gray-600"><strong>Additional Notes:</strong> {booking.additional_notes}</p>
      </div>

      {/* Conditional Rendering for Review Form */}
      {booking.status === "completed" ? (
        <ReviewForm
          userId={booking.userId}
          vehicleId={booking.vehicleId}
          bookingId={booking._id}
        />

        
      ) : booking.status === "canceled" ? (
        <p className="text-center text-red-600 mt-8">
          Reviews cannot be submitted for canceled bookings.
        </p>
        
      ) : (
        <p className="text-center text-gray-600 mt-8">
          Reviews can only be submitted for completed bookings.
        </p>
      )}
      <MyReviews bookingId={booking._id} />
    </div>
  );
};

export default BookingDetail;