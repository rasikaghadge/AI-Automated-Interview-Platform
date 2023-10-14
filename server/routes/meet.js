import express from "express";
import { auth } from "../middleware/auth";
import { createNewMeeting } from "../controllers/meet";

const router = express.Router();

router.post("/new_meeting", auth, createNewMeeting);

export default router;
