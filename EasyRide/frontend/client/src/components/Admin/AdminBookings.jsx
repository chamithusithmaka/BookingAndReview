import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        setBookings(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  // Handle delete booking
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/booking/delete/${bookingId}`);
        setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
        alert("Booking deleted successfully.");
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again.");
      }
    }
  };

  if (loading) {
    return <p className="text-center text-muted">Loading bookings...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-center text-muted">No bookings available.</p>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">All User Bookings</h1>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Pickup Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>{booking.userId}</td>
                <td>{booking.name}</td>
                <td>{new Date(booking.pick_up_date).toLocaleDateString()}</td>
                <td>{new Date(booking.return_date).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      booking.status === "completed"
                        ? "bg-success"
                        : booking.status === "canceled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>${booking.total_price}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;