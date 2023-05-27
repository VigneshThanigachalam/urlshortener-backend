import express from "express";
import fs from "fs";
import {
  createUser,
  loginUserCtrl,
  forgetPasswordtoken,
  updatepassword,
  resetPassword,
  validateToken,
  logOut,
  savedCount,
  getsavedUrl,
} from "../Controller/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const authRouter = express.Router();
authRouter.post("/login", loginUserCtrl);
authRouter.post("/register", createUser);
authRouter.put("/password", authMiddleware, updatepassword);
authRouter.post("/forget-password", forgetPasswordtoken);
authRouter.put("/reset-password", resetPassword);
authRouter.post("/validateToken", authMiddleware, validateToken);
authRouter.put("/log-out", authMiddleware, logOut);
authRouter.put("/savedCount", authMiddleware, savedCount);
authRouter.get("/saved-url", authMiddleware, getsavedUrl);
