import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Ambulance from "../models/Ambulance.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
  try {
    const { userId, ambulanceId, pickup, dropoff } = req.body;
    console.log('Received pickup:', pickup);
console.log('Received dropoff:', dropoff);
console.log('Booking Data:', req.body); // Log the request body

    // Validate input
    if (!userId || !ambulanceId || !pickup || !dropoff) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate data types
    if (
      !pickup.name || pickup.lat === undefined || pickup.lng === undefined ||
      !dropoff.name || dropoff.lat === undefined || dropoff.lng === undefined
    ) {
      return res.status(400).json({ message: "Pickup and Dropoff must include name, lat, and lng" });
    }

    // Check if user and ambulance exist
    const user = await User.findById(userId);
    const ambulance = await Ambulance.findById(ambulanceId);

    if (!user || !ambulance) {
      return res.status(404).json({ message: "User or Ambulance not found" });
    }

    // Create booking
    const newBooking = new Booking({
      userId: new mongoose.Types.ObjectId(userId),
      ambulanceId: new mongoose.Types.ObjectId(ambulanceId),
      pickup: {
        name: pickup.name,
        lat: pickup.lat,
        lng: pickup.lng
      },
      dropoff: {
        name: dropoff.name,
        lat: dropoff.lat,
        lng: dropoff.lng
      },
      status: "pending"
    });
     console.log("Booking object:", newBooking); // Log the booking object
    await newBooking.save();
    console.log("✅ Booking saved:", newBooking);
    res.status(201).json({ message: "Booking created", booking: newBooking });

  } catch (error) {
    console.error("❌ Booking Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getUserBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};