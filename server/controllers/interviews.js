import dotenv from 'dotenv';
import Interview from '../models/Interview.js';
import User from '../models/userModel.js';
// import Profile from '../models/ProfileModel.js';
import { createVideoSdkRoom, fetchVideoSdkRooms, validateVideoSdkRoom, deactivateVideoSdkRoom } from "../helper/videosdkHelper.js";


dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL
const VIDEOSDK_TOKEN = process.env.VIDEOSDK_TOKEN
const API_AUTH_URL = null;


export const listMeetings = async (req, res) => {
  // Sample data
  const meetings = [
    {
      id: 1,
      title: "Meeting 1",
      description: "This is meeting 1",
      startTime: "2022-01-01T10:00:00Z",
      endTime: "2022-01-01T11:00:00Z",
    },
    {
      id: 2,
      title: "Meeting 2",
      description: "This is meeting 2",
      startTime: "2022-01-02T10:00:00Z",
      endTime: "2022-01-02T11:00:00Z",
    },
    // Add more meetings as needed
  ];

  res.json(meetings);
};

export const getMeeting = async (req, res) => {
  // Sample data
  const meetingId = req.params.id;
  const interview = await Interview.findById(meetingId);
  if (!interview) {
    return res.status(500).json({ message: "Interview not found" });
  }
  res.json(interview);
};

export const scheduleMeeting = async (req, res) => {
  // Get meeting details from request body
  const { title, description, startDate, startTime, endTime, email } = req.body;
  const options = {
    method: "GET",
    headers: {
      Authorization: req.headers.authorization.split(" ")[1],
      "Content-Type": "application/json"
    },
  };
  const sdkMeeting = await createVideoSdkRoom(options);
  if (!sdkMeeting) {
    return res.status(500).json({ message: "Error in creating meeting" });
  }
  // console.log(email);
  let user = await User.findOne({ email: email }).select('-password');
  if (!user) {
    return res.status(500).json({ message: "User not found" });
  }
  // concat user and userProfile
  let hr = await User.findOne({ email: req.email }).select('-password');
  console.log(user);
  const interview = new Interview({
    id: sdkMeeting.id,
    title: title,
    description: description,
    startDate: startDate,
    startTime: startTime,
    endTime: endTime,
    candidate: user,
    hr: hr,
    status: "Scheduled",
    room: sdkMeeting
  });

  try {
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const listInterviewsCandidate = async (req, res) => {
  const candidateId = req.id;
  try {
    // Fetch all interviews for the given HR
    const interviews = await Interview.find({ candidate: candidateId });

    // Iterate through the interviews array and add candidateName field
    const interviewsWithHRNames = await Promise.all(
      interviews.map(async (interview) => {
        try {
          const hrUser = await User.findById(interview.hr);
          const hrProfile = await Profile.findById(hrUser.profile);
          const hrName = hrUser
            ? `${hrUser.firstName} ${hrUser.lastName}`
            : '';

          const candidateUser = await User.findById(interview.candidate);
          const candidateName = candidateUser
            ? `${candidateUser.firstName} ${candidateUser.lastName}`
            : '';
          const profilePicture = hrProfile.profilePicture;
          return {
            ...interview._doc,
            hrName,
            candidateName,
            profilePicture
          };
        } catch (error) {
          console.error('Error fetching hr user:', error);
          return interview;
        }
      })
    );

    res.status(200).json(interviewsWithHRNames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const listInterviewsHR = async (req, res) => {
  const hrId = req.id;
  try {
    // Fetch all interviews for the given HR
    const interviews = await Interview.find({ hr: hrId });

    // Iterate through the interviews array and add candidateName field
    const interviewsWithCandidateNames = await Promise.all(
      interviews.map(async (interview) => {
        try {
          const candidateUser = await User.findById(interview.candidate);
          const candidateProfile = await Profile.findById(candidateUser.profile);
          const candidateName = candidateUser
            ? `${candidateUser.firstName} ${candidateUser.lastName}`
            : '';
          const profilePicture = candidateProfile.profilePicture;
          return {
            ...interview._doc,
            candidateName,
            profilePicture
          };
        } catch (error) {
          console.error('Error fetching candidate user:', error);
          return interview;
        }
      })
    );

    res.status(200).json(interviewsWithCandidateNames);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};