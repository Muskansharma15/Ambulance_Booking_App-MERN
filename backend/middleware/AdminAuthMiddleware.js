//import jwt from "jwtwebtoken";
import jwt from "jsonwebtoken";  // Correct

import Admin from "../models/Admin.js";

export const protectedAdmin=async(req,res,next)=>{
let token;
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token=req.headers.authorization.split(" ")[1];
    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.admin=await Admin.findById(decoded.id).select("-password");
        next();
   }catch(err){
    return res.status(401).json({message:"Not Authorized"});
    } 
} else{
        res.status(401).json({message:"Token not found, authorization denied"});
    }
}

