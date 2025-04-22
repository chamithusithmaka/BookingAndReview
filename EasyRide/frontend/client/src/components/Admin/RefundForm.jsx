import React, { useState } from "react";
import axios from "axios";

const RefundBookingForm = ({ bookingId, userId, userName, totalPrice, onClose, onRefundCreated }) => {
  const [refundAmount, setRefundAmount] = useState(totalPrice);
  const [refundNote, setRefundNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/refunds", {
        bookingId, // Include bookingId in the request payload
        userId,
        userName,
        totalPrice,
        refundAmount,
        refundNote,
      });

      alert("Refund created successfully!");
      onRefundCreated(response.data); // Pass the created refund data back to the parent
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating refund:", error);
      alert("Failed to create refund. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRefundSubmit}>
      <div className="mb-3">
        <label htmlFor="refundAmount" className="form-label">
          Refund Amount
        </label>
        <input
          type="number"
          className="form-control"
          id="refundAmount"
          value={refundAmount}
          onChange={(e) => setRefundAmount(e.target.value)}
          min="0"
          max={totalPrice}
          required
        />
        <small className="text-muted">Maximum refund amount: ${totalPrice}</small>
      </div>
      <div className="mb-3">
        <label htmlFor="refundNote" className="form-label">
          Refund Note (Optional)
        </label>
        <textarea
          className="form-control"
          id="refundNote"
          rows="3"
          value={refundNote}
          onChange={(e) => setRefundNote(e.target.value)}
        ></textarea>
      </div>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? "Processing..." : "Submit Refund"}
        </button>
      </div>
    </form>
  );
};

export default RefundBookingForm;