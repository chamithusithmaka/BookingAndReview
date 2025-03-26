import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
                    className="btn btn-primary btn-sm"
                    onClick={() => alert(`Viewing booking details for ID: ${booking._id}`)}
                  >
                    View
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