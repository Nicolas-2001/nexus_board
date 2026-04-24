import { Router } from "express";
import { getAllUsers, getUserById, updateUser, setUserStatus } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.patch("/:id/status", setUserStatus);

export default router;
