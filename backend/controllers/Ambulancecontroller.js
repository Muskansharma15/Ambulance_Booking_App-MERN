import { validationResult } from "express-validator";
import Ambulance from "../models/Ambulance.js";
//import * as AmbulanceService from "../services/AmbulanceService.js";
import { io, onlineUsers } from "../server.js"; // Import the io instance from server.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blacklisttoken from "../models/Blacklisttoken.js";
import Booking from "../models/Booking.js"; // to update booking status
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";  

// ✅ Token generation function using environment variables
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// ✅ Signup Ambulance with password hashing
export const signupAmbulance = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone_number, vehicle_number, location } = req.body;

    const existingAmbulance = await Ambulance.findOne({ email });
    if (existingAmbulance) {
      return res.status(400).json({ message: "Ambulance already exists" });
    }

    //hashed automatically by pre-save hook
     const ambulance = new Ambulance({
      name,
      email,
      password,
      phone_number,
      vehicle_number,
      location,
    });

    await ambulance.save();

    const token = ambulance.generateAuthToken();

    res.status(201).json({
      message: "Ambulance registered successfully",
      ambulance_token: token,
      ambulance
    });

  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Refined Login with proper token handling


export const loginAmbulance = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🚀 Incoming Request:", req.body);  // Log the request

    // 🔥 Add .select("+password") to include the password field
    const ambulance = await Ambulance.findOne({ email }).select("+password");
    console.log("🔍 Retrieved Ambulance:", ambulance);
    if (!ambulance) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const isMatch = await bcrypt.compare(password, ambulance.password);

    if (!isMatch) {
      console.log("❌ Password does not match.");
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { ambulanceId: ambulance._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({
      ambulance_token: token,
      ambulance: {
        id: ambulance._id,
        name: ambulance.name,
        email: ambulance.email
      }
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


// ✅ Improved Logout with blacklist check
export const logoutAmbulance = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    if (token) {
      await Blacklisttoken.create({ token });
      console.log("✅ Token blacklisted successfully:", token);
    }

    res.status(200).json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// ✅ Get ambulance profile with better error handling
export const getAmbulanceProfile = async (req, res) => {
  res.status(200).json(req.ambulance);
};

// Edit User Profile (Update)
export const editAmbulanceProfile = async (req, res) => {
  const { name, email } = req.body;
  const ambulanceId = req.ambulance._id;

  try {
    const updatedAmbulance = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      { name, email },
      { new: true }
    );

    if (!updatedAmbulance) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      ambulance: updatedAmbulance
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Delete User Profile
export const deleteAmbulanceProfile = async (req, res) => {
  const ambulanceId = req.ambulance._id;

  try {
    // First delete user profile
    const deletedAmbulance = await Ambulance.findByIdAndDelete(ambulanceId);

    if (!deletedAmbulance) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
// ✅ Middleware for token validation and blacklist check
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // ✅ Check if token is blacklisted
  const isBlacklisted = await Blacklisttoken.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.ambulance = { id: decoded.id };
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


// Update booking status (accept, reject, complete)
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("userId", "name email");

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const userSocketId=onlineUsers[updatedBooking.userId._id.toString()];
    if(userSocketId){

    io.to(userSocketId).emit("bookingStatusUpdate", {
      message: `Your ride request has been ${status}.`,
      bookingId,
      status,
    });
    console.log(`✅ Sent booking status update to user: ${updatedBooking.userId.name}`);
  } else {
    console.log(`⚠️ User is offline, could not send status update: ${updatedBooking.userId.name}`);
  }

    res.status(200).json({
      message: `Booking ${status} successfully`,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};
