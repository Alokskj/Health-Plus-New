import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import { config } from "../config/config.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded?.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized - No User Info" });
      }
      const hasRequiredRole = roles.some(role => req.user.role.includes(role));
      if (!hasRequiredRole) {
        return res.status(403).json({ error: "Forbidden, You are not authorized to perform this action." });
      }
      next();
    } catch (error) {
      console.error("Error in role check:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};


export { protectRoute, checkRole };
