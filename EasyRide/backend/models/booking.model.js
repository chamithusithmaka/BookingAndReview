import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true }, // Reference to Vehicle model
    userId: { type: String, required: true },
    name: { type: String, required: true },
    pick_up_date: { type: Date, required: true },
    return_date: { type: Date, required: true },
    no_of_dates: { type: Number, required: true },
    phone_number: { type: Number, required: true },
    total_price: { type: Number, required: true },
    additional_notes: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "completed", "canceled"], default: "pending" },
    cancellationReason: { type: String }, // Reason for canceling the booking
    paymentReceipt: { type: String }, // Payment receipt stored as a Base64 string
    canceledAt: { type: Date }, // Timestamp of when the booking was canceled
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);