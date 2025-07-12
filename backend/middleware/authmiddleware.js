import jwt from "jsonwebtoken";
import Blacklisttoken from "../models/Blacklisttoken.js";

const authmiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const blacklisted = await Blacklisttoken.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.userId) {
            req.user = decoded;    
                } else if (decoded.id) {
            req.ambulance = decoded;    
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }

        next();
    } catch (error) {
        console.error("🔥 Middleware Error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authmiddleware;
