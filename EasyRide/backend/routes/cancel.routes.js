import express from "express";
import { requestCancellation, approveCancellation, completeRefund } from "../controllers/cancel.controller.js";

const router = express.Router();

// User requests cancellation
router.post("/:bookingId/cancel", requestCancellation);

// Admin approves cancellation
router.post("/:bookingId/cancel/approve", approveCancellation);

// Admin marks refund as completed
router.post("/:bookingId/refund/complete", completeRefund);

export default router;
