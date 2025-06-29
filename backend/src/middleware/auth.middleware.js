import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // ✅ First try Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ If not found in headers, try cookie
    if (!token && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SEC_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protected middleware", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
