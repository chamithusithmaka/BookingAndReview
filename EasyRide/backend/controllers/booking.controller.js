import Booking from "../models/booking.model.js";
import Cancel from "../models/cancel.model.js";
import Notification from "../models/notification.model.js";

// Get all bookings
export const getAllBookings = async (req, res, next) => {
    let bookings;

    try {
        bookings = await Booking.find();
    } catch (err) {
        console.log(err);

    }

    if (!bookings) {
        return res.status(404).json({ message: "No bookings found" });
    }

    return res.status(200).json({ bookings });
};

// Add new booking
export const addBookings = async (req, res, next) => {
    const { name, pick_up_date, return_date, no_of_dates, phone_number, total_price, additional_notes } = req.body;

    let bookings;

    try {
        bookings = new Booking({ name, pick_up_date, return_date, no_of_dates, phone_number, total_price, additional_notes });
        await bookings.save();
    } catch (err) {
        console.log(err);
    }

    if (!bookings) {
        return res.status(404).json({ message: "Unable to add bookings" });
    }

    return res.status(200).json({ bookings });
};

// Get booking by ID
export const getById = async (req, res, next) => {
    const id = req.params.id;

    let booking;

    try {
        booking = await Booking.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ booking });
};

// Update booking
export const updateBooking = async (req, res, next) => {
    const id = req.params.id;
    const { name, pick_up_date, return_date, no_of_dates, phone_number, total_price, additional_notes } = req.body;

    let booking;

    try {
        booking = await Booking.findByIdAndUpdate(id, { name, pick_up_date, return_date, no_of_dates, phone_number, total_price, additional_notes });
        await booking.save();
    } catch (err) {
        console.log(err);
    }

    if (!booking) {
        return res.status(404).json({ message: "Unable to update Booking Details" });
    }

    return res.status(200).json({ booking });
};

// Cancel booking

export const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body; // Get the reason for cancellation from the request body

  if (!reason) {
    return res.status(400).json({ message: "Cancellation reason is required" });
  }

  try {
    // Find the booking by ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the booking has a pending cancellation request
    const cancelRequest = await Cancel.findOne({ bookingId: id });
    if (cancelRequest && cancelRequest.status === "pending") {
      return res.status(400).json({ message: "Cannot cancel booking with a pending cancellation request" });
    }

    // Check if the booking can be canceled (only confirmed bookings can be canceled)
    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed bookings can be canceled" });
    }

    // Calculate refund eligibility (within 2 days)
    const currentDate = new Date();
    const bookingDate = new Date(booking.createdAt);
    const timeDiff = (currentDate - bookingDate) / (1000 * 60 * 60 * 24); // Convert to days

    let refundAmount = 0;
    if (timeDiff <= 2) {
      refundAmount = booking.paymentAmount * 0.9; // 90% refund if canceled within 2 days
    }

    // Create a new cancellation entry with the provided reason
    const cancelRequestEntry = new Cancel({
      bookingId: booking._id,
      cancellationReason: reason, // Store the reason for cancellation
      refundAmount,
      status: "approved",
      bankDetails: {}, // Assuming bank details are not required here
    });

    await cancelRequestEntry.save();

    // Update the booking status to "cancelled"
    booking.status = "cancelled";
    booking.refundAmount = refundAmount;
    booking.refundStatus = refundAmount > 0 ? "pending" : "not_eligible";
    await booking.save();

    // Send a notification to the user
    const notification = new Notification({
      userId: booking.userId,
      message: `Your booking #${id} has been successfully canceled. Refund of ${refundAmount} is ${refundAmount > 0 ? 'pending' : 'not eligible'}.`,
      type: "booking_cancelled",
      status: "unread",
    });
    await notification.save();

    return res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};






