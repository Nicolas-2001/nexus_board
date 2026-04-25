import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import boardRoutes from "./board.route.js";
import taskRoutes from "./task.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authMiddleware, userRoutes);
router.use("/boards", authMiddleware, boardRoutes);
router.use("/tasks", authMiddleware, taskRoutes);

export default router;
