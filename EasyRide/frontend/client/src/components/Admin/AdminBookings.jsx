import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faEye, 
  faSpinner, 
  faCarSide, 
  faFilter,
  faSearch, 
  faCalendarAlt,
  faExclamationCircle,
  faCheckCircle,
  faBan
} from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Fetch all bookings
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        const fetchedBookings = response.data || [];
        setBookings(fetchedBookings);
        setFilteredBookings(fetchedBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  // Handle filtering
  useEffect(() => {
    let result = bookings;
    
    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        booking =>
          booking.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBookings(result);
  }, [statusFilter, searchTerm, bookings]);

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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FontAwesomeIcon icon={faCheckCircle} className="me-1" />;
      case "canceled":
        return <FontAwesomeIcon icon={faBan} className="me-1" />;
      default:
        return <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />;
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
            <h4 className="text-muted">Loading bookings...</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div className="vh-100 bg-dark text-white position-fixed" style={{ width: "250px" }}>
      <AdminSidebar />
      </div>
      <div className="container mt-5" style={{ marginLeft: "250px" }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <h1 className="h2 mb-0 fw-bold d-flex align-items-center">
            <FontAwesomeIcon icon={faCarSide} className="text-primary me-3" />
            All User Bookings
          </h1>

          <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0 ms-md-3 mt-3 mt-md-0">
            <div className="search-wrapper position-relative me-2 me-md-3">
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: "200px" }}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="position-absolute text-muted"
                style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
            
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="card shadow-sm border-0 p-5">
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-secondary mb-3" />
              <h4 className="text-muted">No bookings found matching your filters</h4>
              {searchTerm || statusFilter !== "all" ? (
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Clear Filters
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="py-3 px-4" style={{ minWidth: "50px" }}>#</th>
                    <th className="py-3 px-4" style={{ minWidth: "180px" }}>Customer</th>
                    <th className="py-3 px-4" style={{ minWidth: "150px" }}>Pickup Date</th>
                    <th className="py-3 px-4" style={{ minWidth: "150px" }}>Return Date</th>
                    <th className="py-3 px-4" style={{ minWidth: "120px" }}>Status</th>
                    <th className="py-3 px-4" style={{ minWidth: "100px" }}>Price</th>
                    <th className="py-3 px-4 text-center" style={{ minWidth: "150px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking._id}>
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}>
                            <span className="text-primary fw-bold">{booking.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ms-3">
                            <p className="fw-bold mb-0">{booking.name}</p>
                            <small className="text-muted text-truncate d-block" style={{ maxWidth: "150px" }}>{booking.userId}</small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" />
                          {formatDate(booking.pick_up_date)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-danger me-2" />
                          {formatDate(booking.return_date)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${
                            booking.status === "completed"
                              ? "bg-success"
                              : booking.status === "canceled"
                              ? "bg-danger"
                              : "bg-warning"
                          } py-2 px-3 rounded-pill`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 fw-bold">
                        ${parseFloat(booking.total_price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => navigate(`/admin/bookings/${booking._id}`)}
                        >
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          Details
                        </button>
                        {["completed", "canceled"].includes(booking.status) ? (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteBooking(booking._id)}
                            title="Delete Booking"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            disabled
                            title="Cannot delete pending booking"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="card-footer bg-white py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-muted">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;