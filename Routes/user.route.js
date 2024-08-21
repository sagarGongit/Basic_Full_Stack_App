import express from "express";
import { taskModel } from "../Models/task.model.js";
import mongoose from "mongoose";

const userRoute = express.Router();

userRoute.post("/add-task", async (req, res) => {
  const { title, description, status, priority, due_date } = req.body;
  if (!title || !description || !priority || !due_date) {
    return res.status(409).json({
      message: "please fill the required fields",
    });
  }
  const userName = req.body.name;
  const task = await taskModel.findOne({ title });
  try {
    if (task == null || !task) {
      const newTask = new taskModel({
        title,
        description,
        status,
        priority,
        assignee: userName,
        due_date,
      });
      await newTask.save();
      res.status(200).json({
        message: "task is added successfully",
      });
    } else {
      return res.status(401).json({
        message: "task is already assigned",
        asssined: task.assignee,
      });
    }
  } catch (error) {
    res.status(501).json({
      message: "error occured during adding task",
    });
  }
});

userRoute.get("/get-task", async (req, res) => {
  const name = req.body.name;
  const limit = parseInt(req.query.limit) || 0;
  const sort = req.query.sort == "new" ? -1 : 1 || -1;
  try {
    const tasks = await taskModel
      .find({ assignee: name })
      .sort({ timestamp: sort })
      .limit(limit);
    if (!tasks.length > 0) {
      return res.status(404).json({
        message: "tasks not found",
      });
    }
    res.status(200).send(tasks);
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching tasks",
    });
  }
});

userRoute.get("/view-task/:id", async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(409).json({
      message: "invalid id format",
    });
  }
  try {
    const task = await taskModel.find({ _id: taskId });
    if (!task.length > 0) {
      return res.status(404).json({
        message: "task not found please check",
      });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching tasks",
    });
  }
});

userRoute.patch("/update-task/:id", async (req, res) => {
  const { title, status, assignee, due_date } = req.body;
  const taskId = req.params.id;
  const update = { title, status, assignee, due_date };
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(409).json({
      message: "invalid id format",
    });
  }
  const task = await taskModel.find({ _id: taskId });
  try {
    if (status == "done") {
      update.completed_at = new Date(Date.now());
    }
    if (!task.length > 0) {
      return res.status(404).json({
        message: "task not found with id",
        taskId: taskId,
      });
    }
    await taskModel.findByIdAndUpdate(
      { _id: taskId },
      { $set: update },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "tasks update successfully",
    });
  } catch (error) {
    res.status(501).json({
      message: "error occured during updating tasks",
    });
  }
});

userRoute.delete("/delete-task/:id", async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(409).json({
      message: "invalid id format",
    });
  }
  const task = await taskModel.find({ _id: taskId });
  try {
    if (!task.length > 0) {
      return res.status(404).json({
        message: "task not found with id",
        taskId: taskId,
      });
    }
    await taskModel.deleteOne({ _id: taskId });
    res.status(200).json({
      message: "tasks delete successfully",
    });
  } catch (error) {
    res.status(501).json({
      message: "error occured during delete tasks",
    });
  }
});

export default userRoute;
