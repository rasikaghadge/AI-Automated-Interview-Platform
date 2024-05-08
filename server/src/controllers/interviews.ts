import dotenv from "dotenv";
import OpenAI from "openai";
import ChatHistory from "../models/ChatHistory.js";
import Interview from "../models/Interview.js";
import Profile from "../models/ProfileModel.js";
import User from "../models/userModel.js";
import { parseTimeString } from "../helper/helper.js";
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL;
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN;
const API_AUTH_URL = null;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(
  {
    apiKey: OPENAI_API_KEY
  }
);

export const getMeeting = async (req: any, res: any) => {
  // Sample data
  const meetingId = req.params.id;
  const interview = await Interview.findById(meetingId);
  if (!interview) {
    return res.status(500).json({ message: "Interview not found" });
  }
  res.json(interview);
};

export const scheduleMeeting = async (req: any, res: any) => {
  // Get meeting details from request body
  const { title, description, startDate, startTime, endTime, email, topic, requiredSkills } = req.body;
  const start: any = parseTimeString(startTime, startDate);
  const end: any = parseTimeString(endTime, startDate);
  if((end - start) / 3600000 > 2) {
    return res.status(400).json({detail: "Cannot schedule interview for more than 1 hour"});
  }
  const options = {
    method: "GET",
    headers: {
      Authorization: req.headers.authorization.split(" ")[1],
      "Content-Type": "application/json",
    },
  };
  // TODO - need to figure out library to use for making http requests
  // console.log(email);
  let user = await User.findOne({ email: email }).select("-password");
  if (!user) {
    return res.status(500).json({ message: "User not found" });
  }
  // concat user and userProfile
  let hr = await User.findOne({ email: req.email }).select("-password");
  const interview = new Interview({
    title: title,
    description: description,
    startDate: startDate,
    startTime: startTime,
    endTime: endTime,
    candidate: user,
    hr: hr,
    status: "Scheduled",
    topic: topic,
    requiredSkills: requiredSkills
  });

  try {
    await interview.save();
    res.status(201).json(interview);
  } catch (error: any) {
    res.status(409).json({ message: error.message });
    return;
  }
};

export const listInterviewsCandidate = async (req: any, res: any) => {
  const candidateId = req.id;
  try {
    // Fetch all interviews for the given HR
    const interviews = await Interview.find({ candidate: candidateId });

    // Iterate through the interviews array and add candidateName field
    const interviewsWithHRNames = await Promise.all(
      interviews.map(async (interview: any) => {
        try {
          const hrUser = await User.findById(interview.hr);
          if (!hrUser) {
            return res.status(404).json({ message: "Hr not found" });
          }
          const hrProfile = await Profile.findById(hrUser.profile);
          const hrName = hrUser ? `${hrUser.firstName} ${hrUser.lastName}` : "";

          const candidateUser = await User.findById(interview.candidate);
          const candidateName = candidateUser
            ? `${candidateUser.firstName} ${candidateUser.lastName}`
            : "";
          const profilePicture = hrProfile?.profilePicture;
          return {
            ...interview._doc,
            hrName,
            candidateName,
            profilePicture,
          };
        } catch (error) {
          console.error("Error fetching hr user:", error);
          return interview;
        }
      })
    );

    res.status(200).json(interviewsWithHRNames);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const listInterviewsHR = async (req: any, res: any) => {
  const hrId = req.id;
  try {
    // Fetch all interviews for the given HR
    const interviews = await Interview.find({ hr: hrId });

    // Iterate through the interviews array and add candidateName field
    const interviewsWithCandidateNames = await Promise.all(
      interviews.map(async (interview: any) => {
        try {
          const candidateUser = await User.findById(interview.candidate);

          if (!candidateUser) {
            return res.status(404).json({ message: "User not found" });
          }
          const candidateProfile = await Profile.findById(
            candidateUser.profile
          );
          const candidateName = candidateUser
            ? `${candidateUser.firstName} ${candidateUser.lastName}`
            : "";
          const profilePicture = candidateProfile?.profilePicture;
          return {
            ...interview._doc,
            candidateName,
            profilePicture,
          };
        } catch (error) {
          console.error("Error fetching candidate user:", error);
          return interview;
        }
      })
    );

    res.status(200).json(interviewsWithCandidateNames);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateMeeting = async (req: any, res: any) => {
  const meetingId = req.params.id;
  const { status, penalty } = req.body;
  const updatedMeeting = { status, penalty };
  try {
    const updatedMeetingResponse = await Interview.findByIdAndUpdate(
      meetingId,
      updatedMeeting,
      { new: true }
    );
    res.status(200).json(updatedMeetingResponse);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getInterviewEndTime = async (req: any, res: any) => {
  try {
    const interviewId = req.params.id;
    const interview = await Interview.findById(interviewId, "endTime");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const endTime = interview.endTime;

    return res.json({ endTime });
  } catch (error) {
    console.error("Error fetching endTime from MongoDB:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateAllInterviews = async (req: any, res: any) => {
  // update status of all interviews to completed
  await Interview.updateMany(
    { startDate: { $lt: new Date() }, status: "Scheduled" },
    { status: "Completed" }
  );
  res.status(200).json({ message: "All interviews updated" });
}


export const getCandidateInterviewScore = async (req: any, res: any) => {
  const interviewId = req.params.id;
  try {
    const interviews = await ChatHistory.find({ SessionId: interviewId });
    const humanMessages: any[] = [];
    const aiMessages: any[] = [];

    interviews.forEach(interview => {
        interview.History.forEach((history: any) => {
            const message = JSON.parse(history);
            console.log(message)
            if (message.type === 'human') {
                humanMessages.push(message.data.content);
            } else if (message.type === 'ai') {
                aiMessages.push(message.data.content);
            }
        });
    });
    let prompt = "";
    for (let i = 0; i < humanMessages.length && i < aiMessages.length; i++) {
        prompt += `question: ${aiMessages[i]}\n`;
        prompt += `answer: ${humanMessages[i]}\n\n`;
    }
    // create a prompt for the AI to generate a score
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            { role: "system", content: "Generate a Score for each questions. Give out of 10 for each queustions answer and sum up all and give final score. and also give detailed evaluation." },
            { role: "user", content: prompt },
        ],
    });
    var score: any = response?.choices[0]?.message?.content;
    score.replace(/\n/g, "");
    res.status(200).json({ score });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
}