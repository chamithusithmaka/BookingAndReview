import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    vehicleId: { type: String, required: true },
    userId: { type: String, require: true },
    name: { type: String, required: true },
    pick_up_date: { type: Date, required: true },
    return_date: { type: Date, required: true },
    no_of_dates: { type: Number, required: true },
    phone_number: { type: Number, required: true },
    total_price: { type: Number, required: true },
    additional_notes: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "completed", "canceled"], default: "pending" }
});

export default mongoose.model("Booking", bookingSchema);