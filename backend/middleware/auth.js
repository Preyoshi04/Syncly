import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Middleware to protect routes (only accessible to authenticated users)
export const protect = async (req, res, next) => {
  let token;

  // ✅ Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // ✅ Extract token from header
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find the user by ID and exclude password field
      req.user = await User.findById(decoded.id).select("-password");

      // ✅ Continue to next middleware or route
      return next();
    } catch (error) {
      console.log("TOKEN Verification Error!", error.message);
      return res
        .status(401)
        .json({ message: "Token invalid or expired!", success: false });
    }
  }

  // ✅ If no token was found
  return res
    .status(401)
    .json({ message: "Not authorized, no token!", success: false });
};
