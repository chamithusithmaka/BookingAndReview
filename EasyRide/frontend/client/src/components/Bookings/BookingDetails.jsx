import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import MyReviews from "../reviews/MyReviews";
import ReviewForm from "../reviews/ReviewForm";
import UpdateBookingForm from "./UpdateBookingForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCar, 
  faGasPump, 
  faUsers, 
  faCogs, 
  faCalendarAlt, 
  faTags,
  faUser,
  faMoneyBillWave,
  faStickyNote,
  faEdit,
  faBan,
  faCheckCircle,
  faSpinner,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

const BookingDetail = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasReview, setHasReview] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [refunds, setRefunds] = useState([]);

  // Fetch booking and vehicle details
  useEffect(() => {
    const fetchBookingAndVehicle = async () => {
      try {
        setLoading(true);

        // Fetch booking details
        const bookingResponse = await axios.get(`http://localhost:5000/api/bookings/${id}`);
        const bookingData = bookingResponse.data.booking;
        setBooking(bookingData);

        // Fetch vehicle details
        const vehicleResponse = await axios.get(`http://localhost:5000/api/booking/vehicle-details/${id}`);
        setVehicle(vehicleResponse.data.vehicle);
      } catch (error) {
        console.error("Error fetching booking or vehicle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingAndVehicle();
  }, [id]);

  // Fetch refunds for the booking
  useEffect(() => {
    const fetchRefundDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/refunds/booking/${id}`);
        console.log("Refunds fetched:", response.data); // Debugging log
        setRefunds(response.data); // Set refund details directly
      } catch (error) {
        console.error("Error fetching refund details:", error);
      }
    };

    fetchRefundDetails();
  }, [id]);

  // Handle cancel booking
  const handleCancelBooking = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/booking/cancel/${id}`, {
        cancellationReason,
      });
      setBooking(response.data.booking);
      setShowCancelPopup(false);
      setCancellationReason("");
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  // Get status badge color and icon
  const getStatusDetails = (status) => {
    switch(status) {
      case "completed":
        return { color: "success", icon: faCheckCircle, text: "Completed" };
      case "pending":
        return { color: "warning", icon: faCalendarAlt, text: "Pending" };
      case "canceled":
        return { color: "danger", icon: faBan, text: "Canceled" };
      default:
        return { color: "secondary", icon: faCalendarAlt, text: status };
    }
  };

  // Update the conditional rendering for vehicle details
  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-100">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
        <p className="text-muted">Loading booking and vehicle details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 min-vh-100">
        <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-danger mb-3" />
        <p className="text-danger">Booking details not found.</p>
        <Link to="/bookings" className="btn btn-outline-primary mt-3">Return to Bookings</Link>
      </div>
    );
  }

  // Render booking details even if the vehicle is missing
  const statusDetails = getStatusDetails(booking.status);

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item active" aria-current="page">Booking {id.substring(0, 8)}...</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-5 fw-bold mb-0">
          <FontAwesomeIcon icon={faCar} className="me-3 text-primary" />
          Booking Details
        </h1>
        <span className={`badge bg-${statusDetails.color} fs-6 px-3 py-2`}>
          <FontAwesomeIcon icon={statusDetails.icon} className="me-2" />
          {statusDetails.text}
        </span>
      </div>

      <div className="row g-4">
        {/* Vehicle Details Section */}
        {vehicle ? (
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-lg h-100 overflow-hidden">
              <div className="position-relative">
                <img
                  src={vehicle.image}
                  className="card-img-top"
                  alt={vehicle.vehicleName}
                  style={{ height: "350px", objectFit: "cover" }}
                />
                <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-75 text-white w-100 p-3">
                  <h2 className="h3 mb-0">{vehicle.vehicleName}</h2>
                  <p className="mb-0 small">{vehicle.brand} {vehicle.model} ({vehicle.year})</p>
                </div>
              </div>
              <div className="card-body p-4">
                <h3 className="h5 mb-4 text-primary">Vehicle Information</h3>
                <div className="row g-3">
                  <div className="col-md-6 col-lg-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-3 rounded-circle bg-light">
                        <FontAwesomeIcon icon={faCar} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted d-block">Type</small>
                        <strong>{vehicle.vehicleType}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-3 rounded-circle bg-light">
                        <FontAwesomeIcon icon={faGasPump} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted d-block">Fuel Type</small>
                        <strong>{vehicle.fuelType}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-3 rounded-circle bg-light">
                        <FontAwesomeIcon icon={faUsers} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted d-block">Seating</small>
                        <strong>{vehicle.seating} people</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-3 rounded-circle bg-light">
                        <FontAwesomeIcon icon={faCogs} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted d-block">Transmission</small>
                        <strong>{vehicle.transmission}</strong>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6 col-lg-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-3 rounded-circle bg-light">
                        <FontAwesomeIcon icon={faTags} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted d-block">Price/Day</small>
                        <strong className="text-success">${vehicle.pricePerDay}</strong>
                      </div>
                    </div>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <h4 className="h6 text-muted mb-2">Description</h4>
                <p>{vehicle.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-12 col-lg-8">
            <div className="alert alert-warning">
              <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
              The vehicle associated with this booking has been deleted.
            </div>
          </div>
        )}

        {/* Reservation Information Section */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-lg h-100">
            <div className="card-header bg-primary text-white py-3 border-0">
              <h3 className="h5 mb-0">Reservation Information</h3>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 p-3 rounded-circle bg-light">
                    <FontAwesomeIcon icon={faUser} className="text-primary" />
                  </div>
                  <div>
                    <small className="text-muted d-block">Booked By</small>
                    <strong>{booking.name}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 p-3 rounded-circle bg-light">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary" />
                  </div>
                  <div>
                    <small className="text-muted d-block">Pick-Up Date</small>
                    <strong>{new Date(booking.pick_up_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 p-3 rounded-circle bg-light">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-danger" />
                  </div>
                  <div>
                    <small className="text-muted d-block">Return Date</small>
                    <strong>{new Date(booking.return_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 p-3 rounded-circle bg-light">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-success" />
                  </div>
                  <div>
                    <small className="text-muted d-block">Total Price</small>
                    <strong className="text-success fs-4">${booking.total_price}</strong>
                  </div>
                </div>

                {booking.additional_notes && (
                  <div>
                    <small className="text-muted d-block">Additional Notes</small>
                    <p className="mb-0">{booking.additional_notes}</p>
                  </div>
                )}

                {/* Refund Details Section */}
                {refunds && (
                  <div className="mt-4">
                    <h6 className="text-success mb-3">Refund Details</h6>
                    <ul className="list-group">
                      {Array.isArray(refunds) ? (
                        refunds.map((refund) => (
                          <li key={refund._id} className="list-group-item">
                            <p className="mb-1">
                              <strong>Refund Amount:</strong> ${refund.refundAmount}
                            </p>
                            <p className="mb-1">
                              <strong>Refund Note:</strong> {refund.refundNote || "N/A"}
                            </p>
                            <p className="mb-0">
                              <strong>Refund Date:</strong>{" "}
                              {new Date(refund.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </li>
                        ))
                      ) : (
                        <li className="list-group-item">
                          <p className="mb-1">
                            <strong>Refund Amount:</strong> ${refunds.refundAmount}
                          </p>
                          <p className="mb-1">
                            <strong>Refund Note:</strong> {refunds.refundNote || "N/A"}
                          </p>
                          <p className="mb-0">
                            <strong>Refund Date:</strong>{" "}
                            {new Date(refunds.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form Section */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-lg h-100">
            <div className="card-header bg-light py-3 border-0">
              <h3 className="h5 mb-0">Submit a Review</h3>
            </div>
            <div className="card-body p-4">
              {booking.status === "completed" ? (
                hasReview ? (
                  <div className="alert alert-success">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    You have already submitted a review for this booking.
                  </div>
                ) : (
                  <ReviewForm
                    userId={booking.userId}
                    vehicleId={booking.vehicleId}
                    bookingId={booking._id}
                  />
                )
              ) : (
                <div className="alert alert-info">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                  Reviews can only be submitted for completed bookings.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Reviews Section */}
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-lg h-100">
            <div className="card-header bg-light py-3 border-0">
              <h3 className="h5 mb-0">My Reviews</h3>
            </div>
            <div className="card-body p-4">
              <MyReviews bookingId={booking._id} />
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Popup */}
      {showCancelPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ backgroundColor: '#ffffff' }}>
                <div className="modal-header bg-danger text-white" style={{ opacity: 1 }}>
                  <h5 className="modal-title">
                    <FontAwesomeIcon icon={faBan} className="me-2" />
                    Cancel Booking
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowCancelPopup(false)}></button>
                </div>
                <div className="modal-body" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                  <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
                  <textarea
                    className="form-control mb-3"
                    placeholder="Please provide a reason for cancellation..."
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    rows="3"
                  ></textarea>
                </div>
                <div className="modal-footer" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                  <button className="btn btn-secondary" onClick={() => setShowCancelPopup(false)}>
                    Close
                  </button>
                  <button className="btn btn-danger" onClick={handleCancelBooking}>
                    Confirm Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Booking Popup */}
      {showUpdatePopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content" style={{ backgroundColor: '#ffffff' }}>
                <div className="modal-header bg-primary text-white" style={{ opacity: 1 }}>
                  <h5 className="modal-title">
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Update Booking
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowUpdatePopup(false)}></button>
                </div>
                <div className="modal-body" style={{ backgroundColor: '#ffffff', opacity: 1 }}>
                  <UpdateBookingForm
                    booking={booking}
                    onClose={() => setShowUpdatePopup(false)}
                    onUpdate={(updatedBooking) => {
                      setBooking(updatedBooking);
                      setShowUpdatePopup(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;