import express from "express";
import { AdminLogin,viewAllUsers, viewAllAmbulances, updateAmbulanceStatus, deleteUser,deleteAmbulance,getallBookings } from "../controllers/Admincontroller.js";
import {protectedAdmin} from "../middleware/AdminAuthMiddleware.js";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
const router=express.Router();

router.post("/admin-login",AdminLogin);
router.get("/users",protectedAdmin,viewAllUsers);
router.get("/ambulances",protectedAdmin,viewAllAmbulances);
router.put("/ambulance/:id/status",protectedAdmin,updateAmbulanceStatus);
router.delete("/user/:id",protectedAdmin,deleteUser);
router.delete("/ambulance/:id",protectedAdmin,deleteAmbulance);
router.get("/bookings",protectedAdmin,getallBookings);
router.post('/add-admin', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Debug: Log incoming request body
      console.log("Request Body:", req.body);
  
      // Check if the admin already exists
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Debug: Log the hashed password to check if hashing works
      console.log("Hashed Password:", hashedPassword);
  
      // Create the new admin
      const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
      });
  
      // Save the new admin
      await newAdmin.save();
  
      res.status(201).json({ message: 'Admin added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


export default router;