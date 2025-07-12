import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//import Blacklisttoken from "../models/Blacklisttoken.js";
import User from "../models/User.js";
import Ambulance from "../models/Ambulance.js";
import Booking from "../models/Booking.js";
// Login for admin
export const AdminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });
      if (!admin) {
          console.log("Admin not found");
          return res.status(400).json({ message: "Invalid email or password. Please try again." });
      }
      
      console.log("Stored Hashed Password:", admin.password);
      console.log("Entered Password:", password);
      
      const isMatch = await bcrypt.compare(password, admin.password);
      console.log("Password Match Result:", isMatch);
      
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid email or password. Please try again." });
      }
  
      // Generate JWT token for admin
      const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      // Send response with token and admin data
      res.json({
        token,
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
      });
  
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  };
  

  

//view all users and ambulances
export const viewAllUsers=async(req,res)=>{
    const users=await User.find();
    res.json({users});
}

export const viewAllAmbulances=async(req,res)=>{
    const ambulances=await Ambulance.find();
    res.json({ambulances});
}

//Update ambulance status(approve || disapprove )
export const updateAmbulanceStatus= async(req,res)=>{
    const {id}=req.params;
    const {status}=req.body;
 const ambulance=await Ambulance.findById(id);
 if(!ambulance)
    return res.status(404).json({message:"Ambulance not found"});
   
   ambulance.status=status;
   await ambulance.save();
   res.json({message:"Ambulance status updated"});   
};

//Delete user and Ambulance
export const deleteUser=async(req,res)=>{
 const {id}=req.params;
 await User.findByIdAndDelete(id);
 res.json({message:"user deleted successfully"})
}
export const deleteAmbulance=async(req,res)=>{
    const {id}=req.params;
    await Ambulance.findByIdAndDelete(id);
    res.json({message:"Ambulance deleted successfully"})
   }

  export const getallBookings=async(req,res)=>{
    try{
      const bookings=await Booking.find().populate("userId").populate("ambulanceId");
    res.json({bookings});
    }catch(er){
      console.error("Error fetching bookings:", er);
      res.status(500).json({ message: "Error fetching bookings" });
    }
  }