import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength:[3,'Name must be at least 3 characters long' ] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, Select:false },
  socketId:{type: String},
});
userSchema.methods.generateAuthToken=function(){
  const token =JsonWebTokenError.sign({_id:this.id},process.env.JWT_SECRET)
  return token;
}
userSchema.methods.comparePassword=async function(password) {
  return await bcrypt.compare(password,this.password);
}
userSchema.statics.hashPassword=async function(password) {
  return await bcrypt.haash(password,10);
}

const User = mongoose.model("User", userSchema);

export default User;

