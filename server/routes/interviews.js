import express from "express";
import { createMeeting, validateRoom, fetchRooms } from "../controllers/interviews.js";
import { auth } from "../middleware/auth.js"
const router = express.Router();

router.post("/create", auth, createMeeting);
router.get("/validate/:roomId", auth, validateRoom);
router.get('/rooms', auth, fetchRooms);


export default router;
