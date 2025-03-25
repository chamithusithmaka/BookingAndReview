import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
  const navigate = useNavigate(); // Initialize navigate for routing

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        console.log("API Response:", response.data); // Debug the API response
        setBookings(response.data || []); // Set bookings data
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  const handleViewBooking = (bookingId) => {
    // Navigate to the booking detail page
    navigate(`/booking/${bookingId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-gray-300 rounded-lg shadow-lg bg-white p-4"
            >
              <h2 className="text-lg font-semibold mb-2">{booking.name}</h2>
              <p className="text-gray-600"><strong>Pickup Date:</strong> {new Date(booking.pick_up_date).toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Return Date:</strong> {new Date(booking.return_date).toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Status:</strong> {booking.status}</p>
              <p className="text-gray-600"><strong>Total Price:</strong> ${booking.total_price}</p>
              <button
                onClick={() => handleViewBooking(booking._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;