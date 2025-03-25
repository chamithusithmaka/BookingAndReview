import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userId: {type:String, required: true},
    vehicleId: {type:String, required: true},
    bookingId: {type:String, required: true},
    //userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    //vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true, index: true },
    //bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // Reference to completed booking
    rating: { type: Number, min: 1, max: 5, required: true },
    reviewText: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);