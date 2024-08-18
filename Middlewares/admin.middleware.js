const AdminMiddleware = (req, res, next) => {
  if (req.body.role == "admin") {
    next();
  } else {
    res.status(401).json({
      message: "Unathorized access only admin can access",
    });
  }
};

export default AdminMiddleware;
