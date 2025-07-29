import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SEC_KEY);
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized - Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("ProtectRoute Error:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
