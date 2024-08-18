import express from "express";
import { userModel } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { taskModel } from "../Models/task.model.js";
import AuthMiddleware from "../Middlewares/auth.middleware.js";
import AdminMiddleware from "../Middlewares/admin.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", async (req, res) => {
  const { name, email, age, password, role } = req.body;
  if (role != "admin" && role != "user") {
    return res.status(409).json({
      message: "bad request enter the valid role",
      roles : ["user","admin"]
    });
  }
  try {
    const userRole = await userModel.findOne({ role });
    if (userRole?.role == "admin") {
      return res.status(409).json({
        message: "invalid entry admin already exist",
      });
    }

    const user = await userModel.findOne({ name });
    if (user) {
      return res.status(409).json({
        message: "user already exist",
      });
    }

    bcrypt.hash(password, 3, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "error occured by bcrypt please check",
        });
      }
      if (user == null || !user) {
        const newUser = new userModel({
          name,
          email,
          age,
          password: hash,
          role,
        });
        await newUser.save();
        res.status(200).json({
          message: "user register successfully",
        });
      } else {
        return res.status(401).json({
          message: "user already exist",
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "error occured during registration",
    });
  }
});


authRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "invalid email",
    });
  }
  try {
    bcrypt.compare(password, user.password, (err, result) => {
      var token = jwt.sign(
        {
          role: user.role,
          name: user.name,
        },
        process.env.SECRET_KEY
      );
      if (err) {
        return res.status(501).json({
          message: "error occured by bcrypt please check",
        });
      }
      if (result) {
        return res.status(200).json({
          message: "login successfull",
          token: token,
        });
      } else {
        res.status(401).json({
          message: "invalid password",
        });
      }
    });
  } catch (error) {
    res.status(501).json({
      message: "error occured during login",
    });
  }
});

export default authRoute;
