import express from "express";
import { createMeeting, scheduleMeeting, listMeetings, getMeeting } from "../controllers/interviews.js";
import { hrAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create",hrAuth, createMeeting);

// meeting schedule
router.post("/schedule", scheduleMeeting);
router.get("/list", listMeetings);
router.get("/:meetingId", getMeeting);

export default router;
