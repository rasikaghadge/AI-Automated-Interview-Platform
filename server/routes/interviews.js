import express from "express";
import { getToken, createMeeting, validateMeeting, scheduleMeeting, listMeetings, getMeeting } from "../controllers/interviews.js";
import { hrAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/token", hrAuth, getToken);
router.post("/create", createMeeting);
router.post("/validate/:meetingId", validateMeeting);

// meeting schedule
router.post("/schedule", scheduleMeeting);
router.get("/list", listMeetings);
router.get("/:meetingId", getMeeting);

export default router;
