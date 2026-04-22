import express from "express";
import { sendResponse } from "../utils/helper.js";

const router = express.Router();

router.get("/", (req, res) => {
    sendResponse(res, 200, "Welcome to the Nexus Board API!");
});

export default router;
