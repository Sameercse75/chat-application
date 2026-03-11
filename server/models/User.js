import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email:{type:String, reqiured:true, unique:true},
  fullName:{type:String, reqiured:true,},
  password:{type:String, reqiured:true, minlength:6},
  profilePic:{type:String, default: ""},
  bio:{type:String},
},{timestamps : true});

const User = mongoose.model("User", userSchema);

export default User