import Booking from "../models/booking.model.js";
import Cancel from "../models/cancel.model.js";
import Notification from "../models/notification.model.js";
import { sendRefundNotification } from "./notification.controller.js";

// Request Cancellation (User)
export const requestCancellation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason, bankName, accountNumber, accountHolder, ifscCode } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed bookings can be cancelled" });
    }

    // Calculate refund eligibility (within 2 days)
    const currentDate = new Date();
    const bookingDate = new Date(booking.createdAt);
    const timeDiff = (currentDate - bookingDate) / (1000 * 60 * 60 * 24); // Convert to days

    let refundAmount = 0;
    if (timeDiff <= 2) {
      refundAmount = booking.paymentAmount * 0.9; // 90% refund if canceled within 2 days
    }

    // Create a new cancellation entry with bank details
    const cancelRequest = new Cancel({
      bookingId: booking._id,
      cancellationReason: reason,
      refundAmount,
      status: "pending",
      bankDetails: {
        bankName,
        accountNumber,
        accountHolder,
        ifscCode
      }
    });

    await cancelRequest.save();

    // Update booking status
    booking.status = "cancellation_requested";
    await booking.save();

    res.status(200).json({ message: "Cancellation request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin approves cancellation
export const approveCancellation = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const cancelRequest = await Cancel.findOne({ bookingId });
    if (!cancelRequest) {
      return res.status(404).json({ message: "No cancellation request found" });
    }

    if (cancelRequest.status !== "pending") {
      return res.status(400).json({ message: "Cancellation request already processed" });
    }

    const currentDate = new Date();
    const bookingDate = new Date(booking.createdAt);
    const timeDiff = (currentDate - bookingDate) / (1000 * 60 * 60 * 24);

    if (timeDiff <= 2) {
      booking.refundAmount = booking.paymentAmount * 0.9;
      booking.refundStatus = "pending";
    } else {
      booking.refundAmount = 0;
      booking.refundStatus = "not_eligible";
    }

    cancelRequest.refundAmount = booking.refundAmount;
    cancelRequest.status = "approved";
    await cancelRequest.save();

    booking.status = "cancelled";
    await booking.save();

    // Send refund notification
    const notification = new Notification({
      userId: booking.userId,
      message: `Your cancellation request for booking #${bookingId} has been approved. Refund of ${booking.refundAmount} is pending.`,
      type: "refund_pending",
      status: "unread"
    });
    await notification.save();

    res.status(200).json({ message: "Cancellation approved and refund status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin marks refund as completed
export const completeRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.refundStatus !== "pending") {
      return res.status(400).json({ message: "No pending refund for this booking" });
    }

    booking.refundStatus = "refunded";
    await booking.save();

    const notification = new Notification({
      userId: booking.userId,
      message: `Your refund of ${booking.refundAmount} for booking #${bookingId} has been completed.`,
      type: "refund_completed",
      status: "unread"
    });

    await notification.save();

    res.status(200).json({ message: "Refund marked as completed and user notified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
