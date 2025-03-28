import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navigation from "../vehicles/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarCheck, 
  faSpinner, 
  faFilter, 
  faExclamationTriangle,
  faCarSide, 
  faCalendarAlt, 
  faCheck, 
  faClock,
  faBan
} from "@fortawesome/free-solid-svg-icons";
import Header from "../vehicles/Header";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        const data = response.data || [];
        setBookings(data);
        setFilteredBookings(data);
      } catch (error) {
        setError("Failed to fetch bookings. Please try again later.");
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Apply filter based on booking status
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === "all") {
      setFilteredBookings(bookings);
    } else {
      const filtered = bookings.filter(booking => booking.status === filter);
      setFilteredBookings(filtered);
    }
  };

  // Get status badge color and icon
  const getStatusDetails = (status) => {
    switch(status) {
      case "completed":
        return { color: "success", icon: faCheck, text: "Completed" };
      case "pending":
        return { color: "warning", icon: faClock, text: "Pending" };
      case "canceled":
        return { color: "danger", icon: faBan, text: "Canceled" };
      default:
        return { color: "secondary", icon: faCalendarAlt, text: status };
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navigation />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="display-5 fw-bold text-primary mb-0">
              <FontAwesomeIcon icon={faCalendarCheck} className="me-3" />
              My Bookings
            </h1>
            <p className="text-muted mt-2">Manage all your vehicle reservations</p>
          </div>
          
          <button 
            className="btn btn-outline-primary d-none d-md-block"
            onClick={() => navigate("/vehicles")}
          >
            <FontAwesomeIcon icon={faCarSide} className="me-2" />
            Book New Vehicle
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button 
            className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handleFilterChange('all')}
          >
            All Bookings
          </button>
          <button 
            className={`btn ${activeFilter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => handleFilterChange('pending')}
          >
            <FontAwesomeIcon icon={faClock} className="me-2" />
            Pending
          </button>
          <button 
            className={`btn ${activeFilter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => handleFilterChange('completed')}
          >
            <FontAwesomeIcon icon={faCheck} className="me-2" />
            Completed
          </button>
          <button 
            className={`btn ${activeFilter === 'canceled' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => handleFilterChange('canceled')}
          >
            <FontAwesomeIcon icon={faBan} className="me-2" />
            Canceled
          </button>
        </div>
        
        {isLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
            <p className="text-muted">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            <div>{error}</div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" 
              alt="No bookings" 
              className="mb-4" 
              style={{ width: "120px", opacity: "0.6" }}
            />
            <h3 className="text-muted mb-3">No bookings available</h3>
            <p className="text-muted mb-4">You haven't made any bookings yet.</p>
            <button className="btn btn-primary px-4 py-2" onClick={() => navigate("/vehicles")}>
              <FontAwesomeIcon icon={faCarSide} className="me-2" />
              Book a Vehicle Now
            </button>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filteredBookings.map((booking) => {
              const statusDetails = getStatusDetails(booking.status);
              return (
                <div key={booking._id} className="col">
                  <div className="card h-100 border-0 shadow-sm hover-shadow">
                    <div className="card-header bg-white border-0 pt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 text-truncate" style={{ maxWidth: "70%" }}>
                          {booking.name}
                        </h5>
                        <span className={`badge bg-${statusDetails.color}`}>
                          <FontAwesomeIcon icon={statusDetails.icon} className="me-1" />
                          {statusDetails.text}
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="mb-3 d-flex">
                        <div className="p-2 rounded-3 bg-light me-3" style={{ width: "40px", height: "40px", textAlign: "center" }}>
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                        </div>
                        <div>
                          <small className="text-muted d-block">Pick-up Date</small>
                          <strong>{new Date(booking.pick_up_date).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'short', 
                            day: 'numeric' 
                          })}</strong>
                        </div>
                      </div>
                      
                      <div className="mb-3 d-flex">
                        <div className="p-2 rounded-3 bg-light me-3" style={{ width: "40px", height: "40px", textAlign: "center" }}>
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-danger" />
                        </div>
                        <div>
                          <small className="text-muted d-block">Return Date</small>
                          <strong>{new Date(booking.return_date).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'short', 
                            day: 'numeric' 
                          })}</strong>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                          <small className="text-muted">Total Price</small>
                          <h4 className="fw-bold text-primary mb-0">${booking.total_price.toFixed(2)}</h4>
                        </div>
                        <button 
                          onClick={() => navigate(`/booking/${booking._id}`)} 
                          className="btn btn-outline-primary"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile Book Button */}
        <div className="d-md-none text-center mt-4">
          <button 
            className="btn btn-primary btn-lg w-100"
            onClick={() => navigate("/vehicles")}
          >
            <FontAwesomeIcon icon={faCarSide} className="me-2" />
            Book New Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookings;