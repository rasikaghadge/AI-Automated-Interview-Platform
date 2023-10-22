import express from "express";
import { createMeeting } from "../controllers/interviews.js";
import { auth } from "../middleware/auth.js"
const router = express.Router();

router.post("/create", auth, createMeeting);

export default router;
