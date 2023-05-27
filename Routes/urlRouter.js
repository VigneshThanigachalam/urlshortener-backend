import express from "express";
import { urlController } from "../Controller/urlController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const urlRouter = express.Router();

// Short URL Generator
urlRouter.post('/short', authMiddleware, urlController );
