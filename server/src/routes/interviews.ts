import express from "express";
import { scheduleMeeting, getMeeting, listInterviewsCandidate, listInterviewsHR } from "../controllers/interviews.js";
import InterviewModel from "../models/Interview.js";
import { hrAuth, auth } from "../middleware/auth.js";

const router = express.Router();

// meeting schedule
router.post("/schedule", hrAuth, scheduleMeeting);
router.get("/candidate/:id", auth, listInterviewsCandidate);
router.get("/hr/:id", auth, listInterviewsHR);
router.get("/:id", getMeeting);

router.get("/:id/endtime", async (req, res) => {
  try {
    const interviewId = req.params.id;
    const interview = await InterviewModel.findById(interviewId, "endTime");

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const endTime = interview.endTime;

    return res.json({ endTime });
  } catch (error) {
    console.error('Error fetching endTime from MongoDB:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
