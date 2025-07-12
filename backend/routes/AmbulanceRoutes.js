import express from 'express';
import { body } from "express-validator";
import { 
  signupAmbulance, 
  loginAmbulance, 
  getAmbulanceProfile, 
  logoutAmbulance, updateBookingStatus,
  deleteAmbulanceProfile
} from "../controllers/Ambulancecontroller.js";  
import authMiddleware from '../middleware/authmiddleware.js';  // ✅ Correct import
import { getNearbyAmbulances } from '../services/AmbulanceService.js';
import Ambulance from '../models/Ambulance.js';  // Import the Ambulance model
const router = express.Router();

/**
 * ✅ Signup Route with Validation
 */
router.post(
  '/signup',
  [
    body('name').isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
    body('email').isEmail().withMessage("Enter a valid email"),
    body('password').isLength({ min: 5 }).withMessage("Password must be at least 5 characters long"),
    body('phone_number').isLength({ min: 10, max: 10 }).withMessage("Phone number must be 10 digits long"),
    body('vehicle_number').isLength({ min: 3 }).withMessage("Enter proper vehicle number"),
    body("location.lat").isNumeric().withMessage("Latitude must be a number").optional(),
    body("location.long").isNumeric().withMessage("Longitude must be a number").optional(),
  ],
  signupAmbulance
);

/**
 * ✅ Login Route (Fixed to match frontend)
 */
router.post(
  '/login',   // 🔥 Ensure this matches the frontend route
   loginAmbulance
);
router.get("/online", async (req, res) => {
  const online = await Ambulance.find({ socketId: { $ne: null } });
  res.json(online);
});


router.get('/ambulance-profile', authMiddleware, getAmbulanceProfile);  // ✅ Use the unified middleware
router.put("/ambulance-profile", authMiddleware, getAmbulanceProfile);  // Edit profile route
router.delete("/ambulance-profile", authMiddleware, deleteAmbulanceProfile);  // Delete profile route

router.get('/logout', authMiddleware, logoutAmbulance);  

router.post("/find-ambulances", async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }
    const nearbyAmbulances = await Ambulance.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: 5000, 
        },
      },
    });

    res.json(nearbyAmbulances);
  } catch (error) {
    console.error("Error finding ambulances:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/all-ambulances", async (req, res) => {
  try {
    const ambulances = await Ambulance.find(); // will add status:approved after admin implementation
    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ambulances" });
  }
});
router.put("/booking/status", updateBookingStatus); 

export default router;
