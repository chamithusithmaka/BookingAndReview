import Refund from '../models/refund.js';

// Create a new refund
export const createRefund = async (req, res) => {
    const { bookingId, userId, totalPrice, refundAmount, refundNote, userName } = req.body;

    try {
        const newRefund = new Refund({
            bookingId, // Include bookingId
            userId,
            totalPrice,
            refundAmount,
            refundNote,
            userName,
        });

        const savedRefund = await newRefund.save();
        res.status(201).json(savedRefund);
    } catch (error) {
        res.status(500).json({ message: 'Error creating refund', error });
    }
};

// Get refund details by ID
export const getRefundById = async (req, res) => {
    const { id } = req.params;

    try {
        const refund = await Refund.findById(id);
        if (!refund) {
            return res.status(404).json({ message: 'Refund not found' });
        }
        res.status(200).json(refund);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching refund', error });
    }
};

// Get all refunds
export const getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find();
        res.status(200).json(refunds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching refunds', error });
    }
};

// Update a refund by ID
export const updateRefundById = async (req, res) => {
    const { id } = req.params;
    const { refundAmount, refundNote } = req.body;

    try {
        const updatedRefund = await Refund.findByIdAndUpdate(
            id,
            { refundAmount, refundNote },
            { new: true }
        );

        if (!updatedRefund) {
            return res.status(404).json({ message: 'Refund not found' });
        }

        res.status(200).json(updatedRefund);
    } catch (error) {
        res.status(500).json({ message: 'Error updating refund', error });
    }
};

// Delete a refund by ID
export const deleteRefundById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRefund = await Refund.findByIdAndDelete(id);
        if (!deletedRefund) {
            return res.status(404).json({ message: 'Refund not found' });
        }
        res.status(200).json({ message: 'Refund deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting refund', error });
    }
};
// Get refund details by Booking ID
export const getRefundByBookingId = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const refund = await Refund.findOne({ bookingId });
        if (!refund) {
            return res.status(404).json({ message: 'Refund not found for this booking ID' });
        }
        res.status(200).json(refund);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching refund by booking ID', error });
    }
};