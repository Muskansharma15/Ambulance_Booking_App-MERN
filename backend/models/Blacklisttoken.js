import mongoose from "mongoose";

const BlacklisttokenSchema= new mongoose.Schema({
token:{
    type:String,required:true,unique:true
},
createdAt:{
    type:Date,default:Date.now,expires:3600
}
});
const Blacklisttoken = mongoose.model("Blacklisttoken", BlacklisttokenSchema);

export default Blacklisttoken;
