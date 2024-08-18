import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String,default:"user",enum:["admin","user"] },
},{versionKey:false});

export const userModel = mongoose.model("user", userSchema);
