import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../vehicles/Header";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        setBookings(response.data || []);
      } catch (error) {
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <div className="container py-4">
        <h1 className="text-center text-primary fw-bold">My Vehicle Bookings</h1>
        
        {isLoading ? (
          <div className="d-flex justify-content-center py-5">
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
            <p className="lead text-muted">No bookings available.</p>
            <button className="btn btn-primary" onClick={() => navigate("/vehicles")}>
              Book a Vehicle
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="col">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">{booking.name}</h5>
                    <span className={`badge bg-${booking.status === "completed" ? "success" : "secondary"}`}>{booking.status}</span>
                    <p className="text-muted">Pickup: {new Date(booking.pick_up_date).toLocaleDateString()}</p>
                    <p className="text-muted">Return: {new Date(booking.return_date).toLocaleDateString()}</p>
                    <h4 className="text-primary">${booking.total_price.toFixed(2)}</h4>
                    <button onClick={() => navigate(`/booking/${booking._id}`)} className="btn btn-outline-primary w-100">
                      View Details
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
