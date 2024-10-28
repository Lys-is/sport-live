import { Router } from "express";
import userController from "../controllers/api/auth-controller.js";
const router = new Router();
const { body } = require("express-validator");
import authMiddleware from "../middlewares/auth-middleware.js";
import lkRouter from "./lk-router.js";
import authRouter from "./auth-router.js";

router.use("/lk", lkRouter);
router.use("/auth", authRouter);

export default router;
