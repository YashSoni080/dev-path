import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // 1. Check httpOnly cookie first (primary, secure method)
  if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // 2. Fall back to Authorization header (for API clients / mobile apps)
  if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
