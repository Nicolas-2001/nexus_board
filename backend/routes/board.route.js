import { Router } from "express";
import { getAllBoards, getBoardById, createBoard, updateBoard } from "../controllers/board.controller.js";

const router = Router();

router.get("/", getAllBoards);
router.get("/:id", getBoardById);
router.post("/", createBoard);
router.patch("/:id", updateBoard);

export default router;
