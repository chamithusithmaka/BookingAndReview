import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true, // To associate the refund with a specific booking
  },
  userId: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  refundAmount: {
    type: Number,
    required: true, // Admin can specify the refund amount
  },
  refundNote: {
    type: String,
    default: '',
  },
  userName: {
    type: String,
    required: true, // To store the user's name for reference
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Refund = mongoose.model('Refund', refundSchema);

export default Refund;