import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import CancelBookingForm from "./CancelBookingForm";
import CreateNotificationForm from "./CreateNotificationForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faArrowLeft,
  faUser,
  faCar,
  faMoneyBillWave,
  faCheckCircle,
  faBan,
  faBell,
  faStickyNote,
  faReceipt,
  faSpinner,
  faExclamationCircle,
  faEye,
  faCalendarCheck
} from "@fortawesome/free-solid-svg-icons";

const SpecificBooking = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(null);

  // Fetch booking by ID
  useEffect(() => {
    const fetchBookingAndVehicle = async () => {
      try {
        setLoading(true);
        // Fetch booking details
        const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${id}`);
        const bookingData = bookingResponse.data.booking;
        setBooking(bookingData);
        
        // Fetch vehicle details
        try {
          const vehicleResponse = await axios.get(`http://localhost:5000/api/booking/vehicle-details/${id}`);
          setVehicleDetails(vehicleResponse.data.vehicle);
        } catch (vehicleError) {
          console.error("Error fetching vehicle details:", vehicleError);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndVehicle();
  }, [id]);

  // Handle marking the booking as completed
  const handleCompleteBooking = async () => {
    if (window.confirm("Are you sure you want to mark this booking as completed?")) {
      try {
        const response = await axios.put(`http://localhost:5000/api/booking/complete/${id}`);
        setBooking(response.data.booking);
        alert("Booking marked as completed successfully.");
      } catch (error) {
        console.error("Error completing booking:", error);
        alert("Failed to mark booking as completed. Please try again.");
      }
    }
  };

  // Get status badge color and icon
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return { bg: "success", icon: faCheckCircle, text: "Completed" };
      case "pending":
        return { bg: "warning", icon: faCalendarCheck, text: "Pending" };
      case "canceled":
        return { bg: "danger", icon: faBan, text: "Canceled" };
      default:
        return { bg: "secondary", icon: faCalendarAlt, text: status };
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
        <h4 className="text-muted">Loading booking details...</h4>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-danger mb-3" />
        <h4 className="text-danger">Booking not found</h4>
        <Link to="/admin" className="btn btn-primary mt-3">
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(booking.status);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Link to="/admin" className="btn btn-outline-primary mb-3">
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Back to Bookings
          </Link>
          <h1 className="display-5 fw-bold mb-2">Booking Details</h1>
          <p className="text-muted">
            Booking ID: <span className="fw-bold">{booking._id}</span>
          </p>
        </div>
        <div className={`badge bg-${statusBadge.bg} px-3 py-2 fs-5`}>
          <FontAwesomeIcon icon={statusBadge.icon} className="me-2" />
          {statusBadge.text}
        </div>
      </div>

      <div className="row g-4">
        {/* Main Booking Information */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-3 mb-4">
            <div className="card-header bg-white border-0 pt-4 pb-0">
              <h2 className="h4 text-primary">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Reservation Information
              </h2>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faUser} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Customer Name</small>
                      <h5 className="mb-0">{booking.name}</h5>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faUser} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">User ID</small>
                      <p className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>{booking.userId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Pickup Date</small>
                      <p className="mb-0">{formatDate(booking.pick_up_date)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-danger" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Return Date</small>
                      <p className="mb-0">{formatDate(booking.return_date)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="text-success" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Total Price</small>
                      <h4 className="mb-0 text-success">${booking.total_price}</h4>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faCar} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Vehicle ID</small>
                      <p className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>{booking.vehicleId}</p>
                      {vehicleDetails && (
                        <Link to={`/vehicles/${booking.vehicleId}`} className="text-decoration-none">
                          <small className="text-primary">
                            <FontAwesomeIcon icon={faEye} className="me-1" />
                            View Vehicle
                          </small>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {booking.additional_notes && (
                <div className="mt-4">
                  <div className="d-flex align-items-start">
                    <div className="me-3 p-3 rounded-circle bg-light">
                      <FontAwesomeIcon icon={faStickyNote} className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Additional Notes</small>
                      <p className="mb-0">{booking.additional_notes}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {booking.status === "canceled" && (
  <div className="mt-4 p-3 bg-light rounded-3 border-start border-danger border-4">
    <h6 className="text-danger mb-2">
      <FontAwesomeIcon icon={faBan} className="me-2" />
      Cancellation Details
    </h6>
    <p className="mb-1">
      <strong>Reason:</strong> {booking.cancellationReason || "No reason provided"}
    </p>
    {booking.canceledAt && (
      <p className="mb-0">
        <strong>Canceled on:</strong> {formatDate(booking.canceledAt)}
      </p>
    )}
  </div>
)}

{/* Booking Created Time Information */}
<div className="mt-4 p-3 bg-light rounded-3 border-start border-primary border-4">
  <h6 className="text-primary mb-2">
    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
    Booking History
  </h6>
  {booking.createdAt && (
    <p className="mb-1">
      <strong>Created on:</strong> {formatDate(booking.createdAt)}
      <span className="ms-2 text-muted">
        ({new Date(booking.createdAt).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit'
        })})
      </span>
    </p>
  )}
  {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
    <p className="mb-0">
      <strong>Last updated:</strong> {formatDate(booking.updatedAt)}
      <span className="ms-2 text-muted">
        ({new Date(booking.updatedAt).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit'
        })})
      </span>
    </p>
  )}
</div>

              
              
              
            </div>
          </div>
          
          {/* Vehicle Info Section (if available) */}
          {vehicleDetails && (
            <div className="card border-0 shadow-lg rounded-3">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h2 className="h4 text-primary">
                  <FontAwesomeIcon icon={faCar} className="me-2" />
                  Vehicle Information
                </h2>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-4">
                    <img 
                      src={vehicleDetails.image} 
                      alt={vehicleDetails.model} 
                      className="img-fluid rounded-3 mb-3" 
                      style={{ maxHeight: "160px", objectFit: "cover", width: "100%" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <h4>{vehicleDetails.brand} {vehicleDetails.model} ({vehicleDetails.year})</h4>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-light text-dark">{vehicleDetails.vehicleType}</span>
                      <span className="badge bg-light text-dark">{vehicleDetails.transmission}</span>
                      <span className="badge bg-light text-dark">{vehicleDetails.fuelType}</span>
                      <span className="badge bg-light text-dark">{vehicleDetails.seating} seats</span>
                    </div>
                    <p className="mb-2">{vehicleDetails.description}</p>
                    <p className="text-success fw-bold mb-0">Price per day: ${vehicleDetails.pricePerDay}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Side Actions Panel */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-lg rounded-3 sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-primary text-white">
              <h3 className="h5 mb-0">Booking Actions</h3>
            </div>
            <div className="card-body p-4">
              {booking.status === "pending" ? (
                <div className="d-grid gap-3">
                  <button
                    className="btn btn-success btn-lg d-flex align-items-center justify-content-center"
                    onClick={handleCompleteBooking}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Mark as Complete
                  </button>
                  <button
                    className="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center"
                    onClick={() => setShowCancelPopup(true)}
                  >
                    <FontAwesomeIcon icon={faBan} className="me-2" />
                    Cancel Booking
                  </button>
                  <div className="border-top mt-2 pt-3">
                    <button
                      className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center w-100"
                      onClick={() => setShowNotificationPopup(true)}
                    >
                      <FontAwesomeIcon icon={faBell} className="me-2" />
                      Send Notification
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-grid gap-3">
                  <div className="alert alert-info mb-3">
                    
                    This booking is {booking.status} and cannot be modified.
                  </div>
                  <button
                    className="btn btn-outline-primary btn-lg d-flex align-items-center justify-content-center"
                    onClick={() => setShowNotificationPopup(true)}
                  >
                    <FontAwesomeIcon icon={faBell} className="me-2" />
                    Send Notification
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Receipt Card */}
          {booking.paymentReceipt && (
            <div className="card border-0 shadow-lg rounded-3 mt-4">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h3 className="h5 mb-0">
                  <FontAwesomeIcon icon={faReceipt} className="text-primary me-2" />
                  Payment Receipt
                </h3>
              </div>
              <div className="card-body p-4">
                <img
                  src={
                    booking.paymentReceipt.startsWith("data:image")
                      ? booking.paymentReceipt
                      : `data:image/png;base64,${booking.paymentReceipt}`
                  }
                  alt="Payment Receipt"
                  className="img-fluid rounded-3 border"
                  style={{ width: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      
{/* Cancel Booking Modal */}
{showCancelPopup && (
  <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered shadow-lg">
        <div className="modal-content" style={{ backgroundColor: '#ffffff' }}>
          <div className="modal-header bg-danger text-white" style={{ opacity: 1 }}>
            <h5 className="modal-title">
              <FontAwesomeIcon icon={faBan} className="me-2" />
              Cancel Booking
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setShowCancelPopup(false)}
            ></button>
          </div>
          <div className="modal-body" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
            <CancelBookingForm
              bookingId={booking._id}
              onClose={() => setShowCancelPopup(false)}
              onCancel={(updatedBooking) => setBooking(updatedBooking)}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* Create Notification Modal */}
{showNotificationPopup && (
  <>
    {/* Dark overlay */}
    <div 
      className="position-fixed top-0 start-0 w-100 h-100" 
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1040
      }}
      onClick={() => setShowNotificationPopup(false)}
    ></div>
    
    {/* Modal dialog */}
    <div className="modal d-block" style={{ zIndex: 1050 }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered shadow-lg">
        <div className="modal-content" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
          <div className="modal-header bg-primary text-white" style={{ opacity: 1 }}>
            <h5 className="modal-title">
              <FontAwesomeIcon icon={faBell} className="me-2" />
              Create Notification
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={() => setShowNotificationPopup(false)}
            ></button>
          </div>
          <div className="modal-body p-4" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
            <CreateNotificationForm
              userId={booking.userId}
              onClose={() => setShowNotificationPopup(false)}
              onNotificationCreated={(notification) => {
                console.log("Notification created:", notification);
                setShowNotificationPopup(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </>
)}
    </div>
  );
};

export default SpecificBooking;