import jwt from "jsonwebtoken";

const AuthMiddleware = async (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(409).json({
      error: "headers is missing please check it out and try again"
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "token not found"
    });
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(501).json({
          error: "error occured by jwt verifiction please check it out",
        });
      }
      if (decoded) {
        req.body.role = decoded.role;
        req.body.name = decoded.name;
        req.body.taskId = decoded.taskId;
        next();
      } else {
        res.status(401).json({
          error: "unathorized access",
        });
      }
    });
  } catch (error) {
    res.status(501).json({
      error: "error occured during authentication",
    });
  }
};

export default AuthMiddleware;
