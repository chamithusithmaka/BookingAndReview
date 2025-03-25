// backend/controllers/notification.controller.js
import Notification from "../models/notification.model.js";

// Function to send a refund notification to the user
export const sendRefundNotification = async (userId, bookingId) => {
  try {
    // Create a new notification
    const notification = new Notification({
      userId: userId,
      message: `Your refund for booking #${bookingId} has been successfully processed.`,
      type: "refund",
      date: new Date(),
    });

    await notification.save();
    console.log("Refund notification sent to user successfully.");
  } catch (error) {
    console.error("Error sending refund notification:", error.message);
  }
};
