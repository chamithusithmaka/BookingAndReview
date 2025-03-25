import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import NotificationIcon from "./Ntification";

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array
  const navigate = useNavigate(); // Initialize navigate for routing

  // Hardcoded userId for now
  const userId = "12345";

  // Uncomment this after implementing login functionality
  // const userId = localStorage.getItem("userId");

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
    <div className="main-container position-relative">
      {/* Notification Icon */}
      <div className="position-absolute top-0 end-0 m-3">
        <NotificationIcon userId={userId} />
      </div>

      <div className="container py-5">
        <h1 className="text-center mb-4">All Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-center text-muted">No bookings available.</p>
        ) : (
          <div className="row g-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{booking.name}</h5>
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
                    <button
                      onClick={() => handleViewBooking(booking._id)}
                      className="btn btn-primary mt-3"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;