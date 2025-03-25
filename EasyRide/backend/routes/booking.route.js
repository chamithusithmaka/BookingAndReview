import express from "express";
import { cancelBooking } from "../controllers/booking.controller.js";
const router = express.Router();

// Insert Model
import Booking from "../models/booking.model.js";
// Insert Booking Controller
import * as BookingController from "../controllers/booking.controller.js";

router.get("/", BookingController.getAllBookings);
router.post("/", BookingController.addBookings);
router.get("/:id", BookingController.getById);
router.put("/:id", BookingController.updateBooking);
router.delete("/:id/cancel", BookingController.cancelBooking);

// export
export default router;


