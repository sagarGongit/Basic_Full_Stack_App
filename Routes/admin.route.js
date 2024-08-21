import express from "express";
import mongoose from "mongoose";
import { userModel } from "../Models/user.model.js";
import { taskModel } from "../Models/task.model.js";

const adminRoute = express.Router();

adminRoute.post("/add-task", async (req, res) => {
  const userName = req.body.name;
  const { title, description, status, priority, due_date } = req.body;
  if (!title || !description || !priority || !due_date) {
    return res.status(409).json({
      message: "please fill the required fields",
    });
  }
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

adminRoute.get("/get-task", async (req, res) => {
  var limit = parseInt(req.query.limit);
  let sort = req.query.sort == "new" ? -1 : 1 || -1;
  try {
    const tasks = await taskModel.find().sort({ timestamp: sort }).limit(limit);
    if (!tasks.length > 0) {
      return res.status(409).json({
        message: "task not found with id",
        taskId: taskId,
      });
    }
    res.status(200).send(tasks);
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching tasks",
    });
  }
});

adminRoute.get("/view-task/:id", async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(501).json({
      message: "invalid id format",
    });
  }
  try {
    const task = await taskModel.find({ _id: taskId });
    if (!task.length > 0) {
      return res.status(409).json({
        message: "task not found with id",
        taskId: taskId,
      });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching tasks",
    });
  }
});

adminRoute.patch("/update-task/:id", async (req, res) => {
  const { title, status, assignee, due_date } = req.body;
  const taskId = req.params.id;
  const update = { title, status, assignee, due_date };
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(501).json({
      message: "invalid id format",
    });
  }
  const task = await taskModel.find({ _id: taskId });
  try {
    if (status == "done") {
      update.completed_at = new Date(Date.now());
    }
    if (!task.length > 0) {
      return res.status(409).json({
        message: "task not found with id",
        taskId: taskId,
      });
    }
    await taskModel.updateOne(
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

adminRoute.delete("/delete-task/:id", async (req, res) => {
  const taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(501).json({
      message: "invalid id format",
    });
  }
  const task = await taskModel.find({ _id: taskId });
  try {
    if (!task.length > 0) {
      return res.status(409).json({
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

adminRoute.get("/get-users", async (req, res) => {
  const limit = parseInt(req.query.limit);
  var sort;
  if (req.query.sort == "asc") {
    sort = -1;
  } else if (req.query.sort == "desc") {
    sort = 1;
  } else {
    sort = 1;
  }
  try {
    const users = await userModel.find().sort({ age: sort }).limit(limit);
    if (!users.length > 0) {
      res.status(404).json({
        message: "users not found",
      });
    }
    res.status(200).send(users);
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching users",
    });
  }
});

adminRoute.get("/view-user/:id", async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(501).json({
      message: "invalid id format",
    });
  }
  try {
    const user = await userModel.find({ _id: userId });
    if (!user.length > 0) {
      return res.status(404).json({
        message: "user not found please check again",
      });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching tasks",
    });
  }
});

adminRoute.delete("/delete-user/:id", async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(501).json({
      message: "invalid id format",
    });
  }
  try {
    const user = await userModel.find({ _id: userId });
    if (!user.length > 0) {
      return res.status(200).json({
        message: "user not found",
        userId: userId
      });
    }
    await userModel.deleteOne({ _id: userId });
    res.status(200).json({
      message: "user deleted successfully",
      name: user.name,
    });
  } catch (error) {
    res.status(501).json({
      message: "error occured during fetching users",
    });
  }
});

export default adminRoute;
