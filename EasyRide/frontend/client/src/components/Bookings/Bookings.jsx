import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NotificationIcon from "./Ntification";
import Header from "../vehicles/Header";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hardcoded userId for now
  const userId = "12345";
  // Uncomment this after implementing login functionality
  // const userId = localStorage.getItem("userId");

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        console.log("API Response:", response.data);
        setBookings(response.data || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleViewBooking = (bookingId) => {
    navigate(`/booking/${bookingId}`);
  };

  // Function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-success";
      case "pending":
        return "bg-warning text-dark";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="bg-light min-vh-100 w-100">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <NotificationIcon userId={userId} />
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <h1 className="display-5 mb-4 fw-bold text-primary">
              My Vehicle Bookings
            </h1>
          </div>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-calendar-x display-4 text-muted mb-3"></i>
            <p className="lead text-muted">No bookings available.</p>
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => navigate("/vehicles")}
            >
              Book a Vehicle
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="col">
                <div className="card h-100 shadow-sm border-0 hover-lift">
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0 text-truncate">
                        {booking.name}
                      </h5>
                      <span
                        className={`badge ${getStatusBadgeClass(
                          booking.status
                        )} rounded-pill`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="small text-muted mb-1">
                        <i className="bi bi-calendar-check me-2"></i>
                        Pickup:{" "}
                        {new Date(booking.pick_up_date).toLocaleDateString()}
                      </div>
                      <div className="small text-muted">
                        <i className="bi bi-calendar-x me-2"></i>
                        Return:{" "}
                        {new Date(booking.return_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="h4 mb-3 text-primary">
                        ${booking.total_price.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleViewBooking(booking._id)}
                        className="btn btn-outline-primary w-100"
                      >
                        View Details
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
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
