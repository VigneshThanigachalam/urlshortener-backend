import { userModel as user } from "../Model/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token = req.headers.token;
  try {
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRETE);
      const userone = await user.findById(decode?.id);
      req.user = userone;
      next();
    } else {
      res.json({
        token: "no toke",
      });
    }
  } catch (err) {
    throw new Error(err);
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await user.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("you are not an admin");
  } else {
    next();
  }
});
