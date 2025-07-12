import express from "express";
import { createBooking, getUserBookings } from "../controllers/Bookingcontroller.js";

const router = express.Router(); // Initialize the router


router.post("/create", createBooking);
router.get("/user/:userId", getUserBookings);
export default router;