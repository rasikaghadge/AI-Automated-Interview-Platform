import express from "express";
import { createMeeting, getMeetingToken, validateMeeting } from "../controllers/interviews.js";
import { hrAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/token", hrAuth, getMeetingToken);
router.post("/create",hrAuth, createMeeting);
router.post("/validate/:meetingId", hrAuth, validateMeeting);

export default router;
