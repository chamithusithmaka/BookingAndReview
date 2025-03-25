import mongoose from "mongoose";

const cancelSchema = new mongoose.Schema(
  {
    userId: {type: String, required: true},
    bookigId: {type: String, required: true},
   // bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    cancellationReason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "completed"], default: "pending" },
    cancelledAt: { type: Date, default: Date.now },
    refundAmount: { type: Number, default: 0 },
    bankDetails: {
      bankName: { type: String, required: true },  // Bank Name
      accountNumber: { type: String, required: true },  // Account Number
      accountHolder: { type: String, required: true },  // Account Holder Name
      ifscCode: { type: String, required: true },  // IFSC Code (or equivalent in your region)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cancel", cancelSchema);
