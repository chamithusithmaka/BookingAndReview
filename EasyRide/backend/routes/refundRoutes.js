import express from 'express';
import {
    createRefund,
    getRefundById,
    getAllRefunds,
    updateRefundById,
    getRefundByBookingId,
    deleteRefundById
} from '../controllers/refundController.js';

const router = express.Router();

// Route to create a refund
// POST: http://localhost:5000/api/refunds
router.post('/', createRefund);

// Route to get refund details by ID
// GET: http://localhost:5000/api/refunds/:id
router.get('/:id', getRefundById);

// Route to get all refunds
// GET: http://localhost:5000/api/refunds
router.get('/', getAllRefunds);

// Route to update a refund by ID
// PUT: http://localhost:5000/api/refunds/:id
router.put('/:id', updateRefundById);

// Route to delete a refund by ID
// DELETE: http://localhost:5000/api/refunds/:id
router.delete('/:id', deleteRefundById);

// GET: http://localhost:5000/api/refunds/booking/:bookingId
router.get('/booking/:bookingId', getRefundByBookingId);


export default router;