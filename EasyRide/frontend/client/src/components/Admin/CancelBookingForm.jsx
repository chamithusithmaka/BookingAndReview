import React, { useState } from "react";
import axios from "axios";

const CancelBookingForm = ({ bookingId, onClose, onCancel }) => {
  const [cancellationReason, setCancellationReason] = useState("");

  const handleCancelBooking = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/booking/cancel/${bookingId}`, {
        cancellationReason,
      });
      onCancel(response.data.booking); // Update the booking in the parent component
      onClose(); // Close the popup
      alert("Booking canceled successfully.");
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("Failed to cancel booking. Please try again.");
    }
  };

  return (
    <div className="popup">
      <h3 className="popup-title">Cancel Booking</h3>
      <textarea
        className="form-control mb-3"
        placeholder="Enter cancellation reason"
        value={cancellationReason}
        onChange={(e) => setCancellationReason(e.target.value)}
        rows="3"
      ></textarea>
      <button className="btn btn-danger me-2" onClick={handleCancelBooking}>
        Confirm Cancel
      </button>
      <button className="btn btn-secondary" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default CancelBookingForm;