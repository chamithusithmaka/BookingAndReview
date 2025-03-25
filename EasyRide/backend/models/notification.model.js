import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {type:String, required: true},
  message: { type: String, required: true },
  type: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);