import express from "express";
import { getToken, createMeeting, validateMeeting } from "../controllers/interviews.js";
import { hrAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/token", hrAuth, getToken);
router.post("/create", createMeeting);
router.post("/validate/:meetingId", validateMeeting);

export default router;
