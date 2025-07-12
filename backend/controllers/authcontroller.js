import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blacklisttoken from "../models/Blacklisttoken.js";

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password. Please try again." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password. Please try again." });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      user_token:token,  // ✅ Send as user_token
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Edit User Profile (Update)
export const editUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.userId;


  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Delete User Profile
export const deleteUserProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    // First delete user profile
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting profile", error: error.message });
  }
};
export const logoutuser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    await Blacklisttoken.create({ token });
  }

  res.status(200).json({ message: "Logged out successfully" });
};
