import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    default: "to-do",
    enum: ["to-do", "in-progress", "done"],
  },
  priority: { type: String, required: true, enum: ["low", "medium", "high"] },
  assignee: { type: String,default:mongoose.Schema.Types.String,ref:"user" },
  timestamp : {type:mongoose.Schema.Types.Date,default:new Date(Date.now())},
  due_date: { type: String, required: true },
  completed_at: { type: mongoose.Schema.Types.Date },
},{versionKey:false});


export const taskModel = mongoose.model("task", taskSchema);
