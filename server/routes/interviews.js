import express from "express";
import { createMeeting, validateRoom, fetchRooms } from "../controllers/interviews.js";
import { auth } from "../middleware/auth.js"
const router = express.Router();

router.post("/create", auth, createMeeting);
router.get("/validate/:roomId", auth, validateRoom);
router.get('/rooms', auth, fetchRooms);


// meeting schedule
router.post("/schedule", scheduleMeeting);
router.get("/list", listMeetings);
router.get("/:meetingId", getMeeting);

export default router;
