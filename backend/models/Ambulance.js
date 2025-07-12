import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ambulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone_number: { type: String, required: true },
  vehicle_number: { type: String, required: true },
  
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },

  socketId: { type: String },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  role: {
    type: String,
    enum: ["ambulance", "user"],
    default: "ambulance"
  }
});

// ✅ Hash password before saving
ambulanceSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

// ✅ JWT Token generation (includes _id and role)
ambulanceSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, role: this.role, status: this.status },  
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

// ✅ Compare password method
ambulanceSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Ensure GeoJSON Index
ambulanceSchema.index({ location: "2dsphere" });

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
export default Ambulance;
