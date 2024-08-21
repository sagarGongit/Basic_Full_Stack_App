import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoute from "./Routes/user.auth.route.js";
import userRoute from "./Routes/user.route.js";
import AuthMiddleware from "./Middlewares/auth.middleware.js";
import AdminMiddleware from "./Middlewares/admin.middleware.js";
import adminRoute from "./Routes/admin.route.js";
import Database_Conn from "./Database/Database_Conn.js";

const PORT = process.env.PORT || 3001;

const server = express();

server.use(express.json());

server.use(cors({ origin: "*" }));

server.use(authRoute);

server.use("/user",AuthMiddleware,userRoute);

server.use("/admin",[AuthMiddleware,AdminMiddleware],adminRoute);

server.get("/", (req, res) => {
  res.status(200).json({
    message: "your server testing is complete",
  });
});

server.listen(PORT, () => {
  Database_Conn();
  console.log(`your server is started on port ${PORT}`);
});
